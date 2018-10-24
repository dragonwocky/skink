/*
 * Skink - A multi-purpose Discord bot.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the ISC License.
 */

const fs = require('fs'),
  path = require('path'),
  secrets = require('./resources/secrets.json');

const Eris = require('eris'),
  bot = new Eris.Client(secrets.TOKEN, {
    getAllUsers: true,
    defaultImageFormat: 'png',
    defaultImageSize: 1024
  });
bot.collection = Eris.Collection;

let utils = require('./resources/utils.js');
for (const util in utils)
  if (utils.hasOwnProperty(util) && typeof utils[util] == 'function')
    utils[util] = utils[util].bind(bot);
bot.utils = utils;

const Datastore = require('nedb');
bot.db = {
  users: new Datastore({ filename: '.data/users.db', autoload: true }),
  guilds: new Datastore({ filename: '.data/guilds.db', autoload: true })
};
bot.db.users.ensureIndex({ fieldName: '_id', unique: true });
bot.db.users.persistence.setAutocompactionInterval(90000);
bot.db.guilds.ensureIndex({ fieldName: '_id', unique: true });
bot.db.guilds.persistence.setAutocompactionInterval(90000);
const keys = [
  'loadDatabase',
  'insert',
  'find',
  'findOne',
  'count',
  'update',
  'remove',
  'ensureIndex',
  'removeIndex'
];
bot.db.guilds = utils.promisifyAll(bot.db.guilds, keys);
bot.db.users = utils.promisifyAll(bot.db.users, keys);

bot.load = async (what, which) => {
  async function config() {
    delete require.cache[require.resolve('./resources/config.json')];
    bot.config = require('./resources/config.json');
    console.log('- loaded config');
  }
  async function events() {
    let type = 'load';
    const files = await utils.walk('./events');
    if (which) {
      which = path.basename(which, '.js');
      const file = file.filter(name => path.basename(name, '.js') === which)[0];
      if (!file || !file.name.endsWith('js')) return false;
      delete require.cache[require.resolve(`.${path.sep}${file}`)];
      const event = require(`.${path.sep}${file}`);
      if (event && event.trigger) {
        if (bot.listeners(which)[0]) {
          type = 'reload';
          bot.removeListener(which, bot.listeners(which)[0]);
        }
        bot.on(which, (...args) => event.trigger(bot, ...args));
        console.log(
          `- ${type}ed event: ${((file = file.split(path.sep)),
          file.slice(1, file.length).join(path.sep))}`
        );
      }
    } else {
      for (let file of files) {
        if (path.extname(file) === '.js') {
          delete require.cache[require.resolve(`.${path.sep}${file}`)];
          const event = require(`.${path.sep}${file}`);
          file = path.basename(file, '.js');
          if (event && event.trigger) {
            if (bot.listeners(file)[0]) {
              type = 'reload';
              bot.removeListener(file, bot.listeners(file)[0]);
            }
            bot.on(file, (...args) => event.trigger(bot, ...args));
          }
        }
      }
      console.log(`- ${type}ed events`);
    }
  }
  async function commands() {
    let type = 'load';
    const files = await utils.walk('./commands');
    if (which) {
      which = path.basename(which, '.js');
      let file = (
        bot.cmds.get(which) ||
        bot.cmds.find(cmd => cmd.aliases && cmd.aliases.includes(which)) || {
          file: false
        }
      ).file;
      if (!file) file = files.filter(f => path.basename(f, '.js') === which)[0];
      if (!file || !file.name.endsWith('js')) return false;
      delete require.cache[require.resolve(`.${path.sep}${file}`)];
      const command = require(`.${path.sep}${file}`);
      if (command && command.name && command.run) {
        bot.cmds.set(command.name, {
          ...command,
          ...{ file: file }
        });
        console.log(
          `- ${type}ed ${
            command.mod ? 'mod' : 'general'
          } command: ${((file = file.split(path.sep)),
          file.slice(1, file.length).join(path.sep))}`
        );
      }
    } else {
      if (bot.cmds) type = 'reload';
      bot.cmds = new bot.collection();
      for (let file of files) {
        if (path.extname(file) === '.js') {
          delete require.cache[require.resolve(`.${path.sep}${file}`)];
          const event = require(`.${path.sep}${file}`);
          if (command && command.name && command.run)
            bot.cmds.set(command.name, {
              ...command,
              ...{ file: file }
            });
        }
      }
      console.log(`- ${type}ed commands`);
    }
  }
  switch (what) {
    case 0:
    case 'config':
      return await config();
      break;

    case 1:
    case 'events':
      return await events();
      break;

    case 2:
    case 'commands':
      return await commands();
      break;

    default:
      await Promise.all([config(), events(), commands()]);
      return true;
  }
};
bot.load().then(() => bot.connect());
