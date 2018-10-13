/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'userprefix',
  aliases: ['prefix'],
  description: 'Sets your personal prefix for communicating with this bot.',
  category: 'Utils',
  usage: '<prefix>',
  args: 1,
  cooldown: 3
};

exports.run = (bot, message, data) => {
  // set user's custom prefix
  bot.db.users.update(
    { _id: message.author.id },
    { $set: { prefix: message.args[0] } },
    {},
    (err, num) => {
      if (err) console.error(err);
      message.channel.send(
        `:triangular_flag_on_post: | **${message.member.nickname ||
          message.author.username}**, your custom prefix has been set to \`${
          message.args[0]
        }\``
      );
    }
  );
};
