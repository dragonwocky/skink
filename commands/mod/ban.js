/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'ban',
  description: 'Bans a user for a specified reason.',
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
  // ban user
  const user =
    message.guild.members.get(message.args[0].replace(/\D/g, '')) ||
    message.guild.members.find(
      member =>
        member.user.username.toLowerCase() === message.args[0].toLowerCase()
    ) ||
    message.guild.members.find(
      member =>
        member.nickname
          ? member.nickname.toLowerCase() === message.args[0].toLowerCase()
          : false
    );
  if (!user || user.id === bot.client.user.id || !user.bannable)
    return message.channel.send(
      bot
        .embed()
        .setDescription(
          `:x: - ${message.author}, ${
            !user
              ? `the first argument must be a valid user from this server!`
              : user.id === bot.client.user.id
                ? `I can't ban myself!`
                : `I can't ban ${user} (they may have a higher role than me)!`
          }`
        )
    );

  let reason = undefined;
  if (message.args[1])
    reason = message.args.slice(1, message.args.length).join(' ');
  message.guild.ban(user, reason).then(member => {
    message.channel.send(
      bot
        .embed()
        .setDescription(
          `:hammer: - ${member.user} was banned by ${message.author}${
            reason ? ` with the reason: \`${reason}\`` : ''
          }`
        )
    );
  });
};
