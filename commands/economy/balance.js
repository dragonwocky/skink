/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'balance',
  aliases: ['bal', 'scales'],
  description: 'Displays how many scales you or another user has.',
  category: 'Economy',
  usage: '[user]',
  cooldown: 3
};

exports.run = (bot, message, data) => {
  // check scale (credit/token) balance
  const getMember = bot.func.user(bot, message, data, message.args[0]);
  if (getMember) {
    const [member, user, fetchUser] = getMember;
    if (user.bot)
      return message.channel.send(
        `:robot: | **${message.member.nickname ||
          message.author.username}**, bots don't need scales!`
      );
    Promise.resolve(fetchUser).then(userDB => {
      message.channel.send(
        `:moneybag: | **${message.member.nickname ||
          message.author.username}**, ${
          member.id === message.author.id
            ? 'you currently have'
            : `**${member.nickname || user.username}** currently has`
        } ${userDB.scales} scale${userDB.scales === 1 ? '' : 's'}.`
      );
    });
  } else
    message.channel.send(
      bot
        .embed()
        .setDescription(
          `:x: - ${
            message.author
          }, the first argument must be a valid user from this server!`
        )
    );
};
