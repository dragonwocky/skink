/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'unmute',
  description: 'Unmutes a user.',
  usage: '<user>',
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
  // removes muted role from user
  const [, , role] = data,
    user = bot.func.member(message, message.args[0]);
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

  if (user.roles.get(role.id)) {
    user.removeRole(role);
    message.channel.send(
      bot
        .embed()
        .setDescription(
          `:sound: - ${message.author}, ${user} has been unmuted.`
        )
    );
  } else
    message.channel.send(
      bot
        .embed()
        .setDescription(`:sound: - ${message.author}, ${user} was not muted!`)
    );
};
