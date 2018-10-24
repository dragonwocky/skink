/*
 * Skink - A multi-purpose Discord bot.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the ISC License.
 */

const { promisify } = require('util'),
  path = require('path'),
  fs = require('fs'),
  readdir = promisify(fs.readdir),
  stat = promisify(fs.stat);

module.exports = {
  // 0: both, 1: top, 2: bottom
  line(string, char, where) {
    let line = char || '=';
    for (let i = 1; i < string.length; i++) {
      line += char;
    }
    switch (where) {
      case 0:
      case 'both':
        return `${line}\n${string}\n${line}`;
        break;

      case 1:
      case 'top':
        return `${line}\n${string}`;
        break;

      case 2:
      case 'bottom':
        return `${string}\n${line}`;
        break;
    }
    return string;
  },

  // (['a', 'b', 'c'], ', ', ' and ') =>  'a, b, and c'
  join(array, char, word) {
    if (array.length === 1) return array[0];
    if (array.length === 2) return array.join(word);
    if (array.length > 2)
      return (
        array.slice(0, -1).join(char) +
        char +
        word +
        array.slice(-1)
      ).replace(/ +/g, ' ');
  },

  // async-ifies JS's built-in forEach
  async foreachAsync(array, callback) {
    for (let i = 0; i < array.length; i++) {
      await callback(array[i], i, array);
    }
  },

  // [1, [[2, [3], [4]], [5]], [6], [[7]]] => [1, 2, 3, 4, 5, 6, 7]
  flatten(array) {
    return array.reduce(
      (flat, next) =>
        flat.concat(Array.isArray(next) ? this.utils.flatten(next) : next),
      []
    );
  },

  // method(thing, callback) => methodAsync(thing)
  promisifyAll(object, keys = Object.getOwnPropertyNames(object)) {
    for (const method in object)
      if (keys.includes(method) && typeof object[method] == 'function')
        object[`${method}Async`] = promisify(object[method]).bind(object);
    return object;
  },

  // recusively read directory contents
  async walk(dir, list = []) {
    const files = (await readdir(dir))
      .map(f => path.join(dir, f))
      .map(
        async f =>
          (await stat(f)).isDirectory()
            ? list.push(await this.utils.walk(f))
            : list.push(f)
      );
    await Promise.all(files);
    return this.utils.flatten(list);
  },

  async muted(guildID) {
    const guildDB = await this.utils.guildDB(guildID),
      guild = this.guilds.get(guildID);
    let role =
      guild.roles.get(guildDB.roles ? guildDB.roles.muted : '') ||
      guild.roles.find(role => role.name.toLowerCase() === 'muted');
    if (!role)
      await this.utils.foreachAsync(
        Array.from(
          guild.channels.filter(channel =>
            channel.permissionsOf(this.user.id).has('manageRoles')
          )
        ),
        async channel => {
          if (!role) {
            role = await guild.createRole(
              {
                name: 'Muted'
              },
              'Create muted role for use with the mute and unmute commands.'
            );
          }
          if (channel.type !== 0) return;
          // 2112 = send messages + add reactions
          channel.editPermission(
            role.id,
            0,
            2112,
            'role',
            'Ensure muted members cannot send messages in this channel.'
          );
        }
      );
    this.db.guilds.updateAsync(
      { _id: guildID },
      { $set: { 'roles.muted': role.id } },
      {}
    );
    return role;
  },

  // returns guild database (creates it if neccessary)
  async guildDB(id) {
    let get = await this.db.guilds
      .findOneAsync({
        _id: id
      })
      .catch(console.error);
    if (!get) {
      get = await this.db.guilds.insert({
        _id: id
      });
      console.log(
        `- Added the guild ${
          this.guilds.get(id).name
        } (ID: ${id}) to the database.`
      );
    }
    return {
      ...{
        disabled: {
          channels: [],
          commands: []
        },
        roles: {
          mod: '',
          muted: ''
        }
      },
      ...get
    };
  },

  // returns user database (creates it if neccessary)
  async userDB(id) {
    let get = await this.db.users
      .findOneAsync({
        _id: id
      })
      .catch(console.error);
    if (!get) {
      get = await this.db.users.insert({
        _id: id
      });
      const user = this.users.get(id);
      console.log(
        `- Added the ${user.bot ? 'bot' : 'user'} ${user.username}#${
          user.discriminator
        } (ID: ${id}) to the database.`
      );
    }
    return {
      ...{
        scales: 0,
        icecream: 0
      },
      ...get
    };
  }

  /* to be dealt with
  getSubject: (message, data, search) => {
    let member = message.member;
    if (search) member = this.member(message, search);
    if (!member) return false;
    const user = member.user;
    if (member.id === message.member.id) return [member, data[0]];
    return [
      member,
      new Promise((resolve, reject) => {
        bot.db.users.findOne({ _id: user.id }, (err, doc) => {
          if (err) console.error(err);
          resolve(doc);
        });
      })
    ];
  }
  // return guild member
  getMember: (message, search) =>
    search
      ? message.guild.members.get(search.replace(/\D/g, '')) ||
        message.guild.members.find(
          member => member.user.username.toLowerCase() === search.toLowerCase()
        ) ||
        message.guild.members.find(
          member =>
            member.nickname
              ? member.nickname.toLowerCase() === search.toLowerCase()
              : false
        )
      : false*/
};
