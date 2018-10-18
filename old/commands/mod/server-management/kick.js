/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'kick',
  description: 'Kicks a member for a specified reason.',
  usage: '<member> [reason]',
  category: 'Mod',
  args: 1,
  cooldown: 3,
  moderator: true,
  perms: {
    member: ['KICK_MEMBERS'],
    bot: ['KICK_MEMBERS']
  }
};

exports.run = (bot, message, data) => {
  // kick member
  const member = bot.func.member(message, message.args[0]);
  if (!member || member.id === bot.client.user.id || !member.kickable)
    return message.channel.send(
      `:x: | **${message.member.nickname || message.author.username}**, ${
        !member
          ? `the first argument must be a valid user from this server`
          : member.id === bot.client.user.id
            ? `I can't kick myself`
            : `I can't kick ${member.nickname ||
                member.user.username} (they may have a higher role than me)`
      }!`
    );

  let reason = undefined;
  if (message.args[1])
    reason = message.args.slice(1, message.args.length).join(' ');
  member.kick(reason).then(kicked => {
    message.channel.send(
      `:boot: | **${message.member.nickname ||
        message.author.username}**, you kicked **${kicked}**${
        reason ? ` with the reason: \`${reason}\`` : ''
      }`
    );
    kicked.send(
      `:boot: | You were kicked from **${message.guild.name}** by **${message
        .member.nickname || message.author.username}**${
        reason ? ` with the reason: \`${reason}\`` : '.'
      }`
    );
  });
};
