/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'transfer',
  aliases: ['pay'],
  description: 'Transfers the specified number of scales to another user.',
  category: 'Economy',
  usage: '<user> <amount>',
  args: 2,
  cooldown: 3
};

exports.run = (bot, message, data) => {
  const user = bot.func.member(message, message.args[0]);
  if (!user)
    return message.channel.send(
      `:x: | **${message.member.nickname ||
        message.author
          .username}**, the first argument must be a valid user from this server!`
    );
  if (user.user.bot)
    return message.channel.send(
      `:robot: | **${message.member.nickname ||
        message.author.username}**, bots don't need scales!`
    );
  let amount = false;
  if (message.args[1]) {
    amount = parseInt(message.args[1]);
    if (isNaN(amount) || amount <= 0)
      return message.channel.send(
        `:x: | **${message.member.nickname ||
          message.author
            .username}**, the second argument must be a number above 0!`
      );
  }
  const fetchUser = new Promise((resolve, reject) => {
    bot.db.users.findOne({ _id: user.id }, (err, doc) => {
      if (err) console.error(err);
      resolve(doc);
    });
  });
  Promise.resolve(fetchUser).then(userDB => {
    if (amount > data[0].scales)
      return message.channel.send(
        `:x: | **${message.member.nickname ||
          message.author.username}**, you do not have that many scales to give!`
      );

    // transfer an amount of scales (credits/tokens) to another user
    bot.db.users.update(
      { _id: message.author.id },
      { $inc: { scales: -amount } },
      { returnUpdatedDocs: true },
      (err, num, updated) => {
        if (err) console.error(err);
        bot.db.users.update(
          { _id: user.id },
          { $inc: { scales: amount } },
          { returnUpdatedDocs: true },
          (error, number, document) => {
            if (err) console.error(err);
            message.channel.send(
              `:x: | **${message.member.nickname ||
                message.author
                  .username}**, you gave **${user}** ${amount} scale${
                amount === 1 ? '' : 's'
              }.`
            );
          }
        );
      }
    );
  });
};
