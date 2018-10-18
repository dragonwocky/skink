/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'icecream',
  description: 'I scream for icecream!',
  category: 'Fun',
  usage: '[user|check|eat]',
  cooldown: 3
};

exports.run = (bot, message, data) => {
  const [userDB] = data;
  switch (message.args[0]) {
    case 'check':
      // respond with icecream count
      const icecream = [':ice_cream:', ':icecream:'];
      message.channel.send(
        `${icecream[Math.floor(Math.random() * icecream.length)]} | **${message
          .member.nickname || message.author.username}**, you have ${
          userDB.icecream
        } icecream${userDB.icecream === 1 ? '' : 's'}! When're you gonna eat ${
          userDB.icecream === 1 ? 'it' : 'them'
        }?`
      );
      break;

    case 'eat':
      if (!userDB.icecream)
        return message.channel.send(
          `:frowning: | **${message.member.nickname ||
            message.author.username}**, you don't have any icecream to eat!`
        );
      // eat icecream
      const generate = (min, max) => {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        amount = generate(1, 10);
      if (Math.random() >= 0.5 && userDB.scales > 10) {
        bot.db.users.update(
          { _id: message.author.id },
          { $inc: { icecream: -1, scales: -amount } },
          {},
          (err, num) => {
            if (err) console.error(err);
            const responses = [
              'What on earth have you been up to recently?',
              'Uh... maybe I should try getting them from somewhere different for you.'
            ];
            message.channel.send(
              `:nauseated_face: | **${message.member.nickname ||
                message.author.username}**, your icecream was poisoned! ${
                responses[Math.floor(Math.random() * responses.length)]
              } (-${amount} Scales)`
            );
          }
        );
      } else
        bot.db.users.update(
          { _id: message.author.id },
          { $inc: { icecream: -1, scales: amount } },
          {},
          (err, num) => {
            if (err) console.error(err);
            const icecream = [':ice_cream:', ':icecream:'];
            message.channel.send(
              `${
                icecream[Math.floor(Math.random() * icecream.length)]
              } | **${message.member.nickname ||
                message.author
                  .username}**, you ate the most delicious icecream you've ever tasted! (+${amount} Scales)`
            );
          }
        );
      break;

    default:
      const getMember = bot.func.user(bot, message, data, message.args[0]);
      if (getMember) {
        const [, user] = getMember;
        if (user.bot)
          return message.channel.send(
            `:robot: | **${message.member.nickname ||
              message.author
                .username}**, icecream will give bots computer-freeze!`
          );
        // give icecream
        bot.db.users.update(
          { _id: user.id },
          { $inc: { icecream: 1 } },
          {},
          (err, num) => {
            if (err) console.error(err);
            const icecream = [':ice_cream:', ':icecream:'];
            message.channel.send(
              `${
                icecream[Math.floor(Math.random() * icecream.length)]
              } | **${message.member.nickname || message.author.username}**, ${
                user.id === message.author.id ? 'have' : `you gave **${user}**`
              } some icecream!`
            );
          }
        );
      } else
        message.channel.send(
          `:x: | **${message.member.nickname ||
            message.author
              .username}**, the first argument must be \`check\`, \`eat\` or a valid user from this server!`
        );
      break;
  }
};
