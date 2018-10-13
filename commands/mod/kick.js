/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'kick',
  description: 'Kicks a user for a specified reason.',
  usage: '<user> [reason]',
  category: 'Mod',
  args: 1,
  cooldown: 3,
  moderator: true,
  perms: {
    user: ['KICK_MEMBERS'],
    bot: ['KICK_MEMBERS']
  }
};

exports.run = (bot, message, data) => {
  // kick user
  const user = bot.func.member(message, message.args[0]);
  if (!user || user.id === bot.client.user.id || !user.kickable)
    return message.channel.send(
      bot
        .embed()
        .setDescription(
          `:x: - ${message.author}, ${
            !user
              ? `the first argument must be a valid user from this server`
              : user.id === bot.client.user.id
                ? `I can't kick myself`
                : `I can't kick ${user} (they may have a higher role than me)`
          }!`
        )
    );

  let reason = undefined;
  if (message.args[1])
    reason = message.args.slice(1, message.args.length).join(' ');
  user.kick(reason).then(member => {
    message.channel.send(
      bot
        .embed()
        .setDescription(
          `:house_abandoned: - ${member.user} was kicked by ${message.author}${
            reason ? ` with the reason: \`${reason}\`` : ''
          }`
        )
    );
  });
};
