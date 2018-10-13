/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'talk',
  aliases: ['chat', 't'],
  description: 'Talk to the bot.',
  category: 'Fun',
  usage: '<message>',
  args: 1,
  cooldown: 3
};

exports.run = (bot, message, data) => {
  // respond to message using cleverbot.io
  bot.clever.setNick(message.author.username);
  bot.clever.create((err, session) => {
    bot.clever.ask(message.content, (err, response) => {
      if (err) console.error(err);
      message.channel.startTyping();
      setTimeout(() => {
        message.channel.send(response);
        message.channel.stopTyping();
      }, Math.random() * (1 - 3) + 1 * 1000);
    });
  });
};
