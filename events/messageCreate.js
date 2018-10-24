/*
 * Skink - A multi-purpose Discord bot.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the ISC License.
 */

exports.trigger = async (bot, message) => {
  /* direct message
  if ([1, 3].includes(message.channel.type)) {
    if (message.author.bot) return;
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
  } */

  if (message.channel.type === 0) {
    const [guildDB, userDB] = await Promise.all([
      bot.utils.guildDB(message.member.guild.id),
      bot.utils.userDB(message.author.id)
    ]);
  }
};
