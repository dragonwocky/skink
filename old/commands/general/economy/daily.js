/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'daily',
  description: 'Collects or grants scales (can only be used once a day).',
  category: 'Economy',
  usage: '[user]',
  cooldown: 3
};

exports.run = (bot, message, data) => {
  const [userDB] = data,
    getMember = bot.func.user(bot, message, data, message.args[0]);
  if (getMember) {
    const [, user] = getMember;
    if (user.bot)
      return message.channel.send(
        `:robot: | **${message.member.nickname ||
          message.author.username}**, bots don't need scales!`
      );
    const today = date => {
      const now = new Date();
      return (
        now.getUTCFullYear() === date.getUTCFullYear() &&
        now.getUTCMonth() === date.getUTCMonth() &&
        now.getUTCDate() === date.getUTCDate()
      );
    };
    if (userDB.daily && today(new Date(userDB.daily)))
      return message.channel.send(
        `:stopwatch: | **${message.member.nickname ||
          message.author
            .username}**, you've already used this command today! You can use it again in ${bot.pack.countdown(
          bot.pack.moment
            .utc()
            .endOf('day')
            .toDate()
        )}.`
      );

    const generate = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      amount = generate(150, 250) + (user.id === message.author.id ? 0 : 50);
    bot.db.users.update(
      { _id: user.id },
      { $set: { daily: new Date().toUTCString() } },
      {},
      (err, num) => {
        if (err) console.error(err);
        bot.db.users.update(
          { _id: user.id },
          {
            $inc: {
              scales: amount
            }
          },
          { returnUpdatedDocs: true },
          (err, num, updated) => {
            if (err) console.error(err);
            message.channel.send(
              `:moneybag: | **${message.member.nickname ||
                message.author.username}**, ${
                user.id === message.author.id
                  ? 'you recieved'
                  : `you gave **${user}**`
              } ${amount} daily scales!`
            );
          }
        );
      }
    );
  } else
    message.channel.send(
      `:x: | **${message.member.nickname ||
        message.author
          .username}**, the first argument must be a valid user from this server!`
    );
};
