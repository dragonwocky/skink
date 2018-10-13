/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'balance',
  aliases: ['bal', 'scales'],
  description: 'Displays how many Scales you or another user has.',
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
        bot
          .embed()
          .setDescription(
            `:robot: - ${message.author}, bots don't need scales!`
          )
      );
    Promise.resolve(fetchUser).then(userDB => {
      message.channel.send(
        bot
          .embed()
          .setDescription(
            `:moneybag: - ${message.author}, ${
              member.id === message.author.id
                ? 'you currently have'
                : `${member} currently has`
            } ${userDB.scales} Scale${userDB.scales === 1 ? '' : 's'}.`
          )
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
