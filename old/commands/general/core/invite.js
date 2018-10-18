/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'invite',
  description: 'Gives a link to invite this bot to another server.',
  category: 'Core',
  cooldown: 3
};

exports.run = (bot, message, data) => {
  // send invite link from config
  message.channel.send(
    `:wave: | **${message.member.nickname ||
      message.author.username}**, add me to your own server: <${
      bot.config.invite
    }>`
  );
};
