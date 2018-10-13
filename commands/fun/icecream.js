/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'icecream',
  description: 'I scream for icecream!',
  category: 'Fun',
  usage: '[user]',
  cooldown: 3
};

exports.run = (bot, message, data) => {
  if (message.args[0] === 'eat') {
    if (!data[0].icecream)
      return message.channel.send(
        bot
          .embed()
          .setDescription(
            `:frowning: - ${
              message.author
            }, you don't have any icecream to eat!`
          )
      );

    // eat icecream
    const generate = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      amount = generate(1, 10);
    if (Math.random() >= 0.5 && data[0].scales > 10) {
      bot.db.users.update(
        { _id: message.author.id },
        { $inc: { icecream: -1, scales: -amount } },
        { returnUpdatedDocs: true },
        (err, num, updated) => {
          if (err) console.error(err);
          const responses = [
            'What on earth have you been up to recently?',
            'Uh... maybe I should try getting them from somewhere different for you.'
          ];
          message.channel.send(
            bot
              .embed()
              .setDescription(
                `:nauseated_face: - ${
                  message.author
                }, your icecream was poisoned! ${
                  responses[Math.floor(Math.random() * responses.length)]
                } (-${amount} Scales)`
              )
              .setFooter(
                `Now you have ${updated.icecream} icecream${
                  updated.icecream === 1 ? '' : 's'
                }! When're you gonna eat ${
                  updated.icecream === 1 ? 'it' : 'them'
                }?`,
                message.author.displayAvatarURL
              )
          );
        }
      );
    } else
      bot.db.users.update(
        { _id: message.author.id },
        { $inc: { icecream: -1, scales: amount } },
        { returnUpdatedDocs: true },
        (err, num, updated) => {
          if (err) console.error(err);
          const icecream = [':ice_cream:', ':icecream:'];
          message.channel.send(
            bot
              .embed()
              .setDescription(
                `${icecream[Math.floor(Math.random() * icecream.length)]} - ${
                  message.author
                }, you ate the most delicious icecream you've ever tasted! (+${amount} Scales)`
              )
              .setFooter(
                `Now you have ${updated.icecream} icecream${
                  updated.icecream === 1 ? '' : 's'
                }! When're you gonna eat ${
                  updated.icecream === 1 ? 'it' : 'them'
                }?`,
                message.author.displayAvatarURL
              )
          );
        }
      );
  } else {
    const getMember = bot.func.user(bot, message, data, message.args[0]);
    if (getMember) {
      const [, user] = getMember;
      if (user.bot)
        return message.channel.send(
          bot
            .embed()
            .setDescription(
              `:robot: - ${
                message.author
              }, icecream will give bots computer-freeze!`
            )
        );

      // give icecream
      bot.db.users.update(
        { _id: user.id },
        { $inc: { icecream: 1 } },
        { returnUpdatedDocs: true },
        (err, num, updated) => {
          if (err) console.error(err);
          const icecream = [':ice_cream:', ':icecream:'];
          message.channel.send(
            bot
              .embed()
              .setDescription(
                `${
                  icecream[Math.floor(Math.random() * icecream.length)]
                } - ${user}, ${
                  user.id === message.author.id
                    ? 'have'
                    : `${message.author} gave you`
                } some icecream!`
              )
              .setFooter(
                `Now you have ${updated.icecream} icecream${
                  updated.icecream === 1 ? '' : 's'
                }! When're you gonna eat ${
                  updated.icecream === 1 ? 'it' : 'them'
                }?`,
                user.displayAvatarURL
              )
          );
        }
      );
    } else
      message.channel.send(
        bot
          .embed()
          .setDescription(
            `:x: - ${
              message.author
            }, the first argument must be \`eat\` or a valid user from this server!`
          )
      );
  }
};
