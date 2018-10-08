/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'mute',
  description: 'Mutes a user.',
  usage: '<user> [seconds]',
  category: 'Mod',
  args: 1,
  cooldown: 3,
  moderator: true,
  perms: {
    user: ['MANAGE_ROLES'],
    bot: ['MANAGE_ROLES']
  }
};

exports.run = (bot, message, data) => {
  // give user muted role
  const [, , role] = data,
    user =
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
  if (!user)
    return message.channel.send(
      bot
        .embed()
        .setDescription(
          `:x: - ${
            message.author
          }, the first argument must be a valid user from this server!`
        )
    );
  let seconds = false;
  if (message.args[1]) {
    seconds = parseInt(message.args[1]);
    if (isNaN(seconds) || seconds <= 0)
      return message.channel.send(
        bot
          .embed()
          .setDescription(
            `:x: - ${
              message.author
            }, the second argument must be a number above 0!`
          )
      );
  }

  user.addRole(role);
  if (seconds)
    bot.client.setTimeout(() => {
      if (user.roles.get(role.id)) user.removeRole(role);
    }, seconds * 1000);
  message.channel.send(
    bot
      .embed()
      .setDescription(
        `:mute: - ${message.author}, ${user} has been muted${
          seconds ? ` for ${seconds} seconds` : ''
        }!`
      )
  );
};
