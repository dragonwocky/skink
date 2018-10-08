/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'pardon',
  aliases: ['unban'],
  description: 'Pardons (unbans) a user for a specified reason.',
  usage: '<user> [reason]',
  category: 'Mod',
  args: 1,
  cooldown: 3,
  moderator: true,
  perms: {
    user: ['BAN_MEMBERS'],
    bot: ['BAN_MEMBERS']
  }
};

exports.run = (bot, message, data) => {
  message.guild.fetchBans().then(bans => {
    const user =
      bans.get(message.args[0].replace(/\D/g, '')) ||
      bans.find(
        banned =>
          banned.username.toLowerCase() === message.args[0].toLowerCase()
      );
    if (!user)
      return message.channel.send(
        bot
          .embed()
          .setDescription(
            `:x: - ${
              message.author
            }, the first argument must be a valid user banned from this server!`
          )
      );

    let reason = undefined;
    if (message.args[1])
      reason = message.args.slice(1, message.args.length).join(' ');
    message.guild.unban(user, reason).then(pardoned => {
      message.channel.send(
        bot
          .embed()
          .setDescription(
            `:unlock: - ${pardoned} was pardoned by ${message.author}${
              reason ? ` with the reason: \`${reason}\`` : ''
            }`
          )
      );
    });
  });
};
