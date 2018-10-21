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

  // [1, [[2, [3], [4]], [5]], [6], [[7]]] => [1, 2, 3, 4, 5, 6, 7]
  flatten(array) {
    return array.reduce(
      (flat, next) =>
        flat.concat(Array.isArray(next) ? this.utils.flatten(next) : next),
      []
    );
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

  //
  async guildDB(id) {
    console.log(await this.utils.walk('./events'));
    let get = await this.db.guilds
      .findOneAsync({
        _id: id
      })
      .catch(console.error);
    if (!get) {
      get = await this.db.guilds.insert({
        _id: id,
        disabled: {
          channels: [],
          commands: []
        }
      });
      console.log(
        `- Added the guild ${
          this.guilds.get(id).name
        } (ID: ${id}) to the database.`
      );
    } else return get;
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
