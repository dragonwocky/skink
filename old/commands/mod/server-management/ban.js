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
  // ban member
  const member = bot.func.member(message, message.args[0]);
  if (!member || member.id === bot.client.user.id || !member.bannable)
    return message.channel.send(
      `:x: | **${message.member.nickname || message.author.username}**, ${
        !member
          ? `the first argument must be a valid user from this server`
          : member.id === bot.client.user.id
            ? `I can't ban myself`
            : `I can't ban ${member.nickname ||
                member.user.username} (they may have a higher role than me)`
      }!`
    );

  let reason = undefined;
  if (message.args[1])
    reason = message.args.slice(1, message.args.length).join(' ');
  message.guild.ban(member, reason).then(banned => {
    message.channel.send(
      `:hammer: | **${message.member.nickname ||
        message.author.username}**, you banned **${banned}**${
        reason ? ` with the reason: \`${reason}\`` : ''
      }`
    );
    banned.send(
      `:hammer: | You were banned from **${message.guild.name}** by **${message
        .member.nickname || message.author.username}**${
        reason ? ` with the reason: \`${reason}\`` : '.'
      }`
    );
  });
};
