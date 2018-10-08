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
  // if (message.args[0] === 'eat') {
  //   // eat icecream
  //   if (data[0].icecream)
  //     return bot
  //       .embed()
  //       .setDescription(
  //         `:frowning: - ${message.author}, you don't have any icecream to eat!`
  //       );
  //   bot.db.users.update(
  //     { _id: user.id },
  //     { $inc: { icecream: -1 } },
  //     { returnUpdatedDocs: true },
  //     (err, num, updated) => {
  //       console.log(updated);
  //       if (err) console.error(err);
  //       const icecream = [':ice_cream:', ':icecream:'];
  //       message.channel.send(
  //         bot
  //           .embed()
  //           .setDescription(
  //             `${
  //               icecream[Math.floor(Math.random() * icecream.length)]
  //             } - ${user}, you ate the most delicious icecream you've ever tasted!`
  //           )
  //       );
  //     }
  //   );
  // } else {

    // give icecream
    let user;
    if (message.args[0]) {
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
    } else user = message.member;
    if (!user)
      return message.channel.send(
        bot
          .embed()
          .setDescription(
            `:x: - ${
              message.author
            }, the first argument must be ` /* \`eat\` or */ + `a valid user from this server!`
          )
      );

    bot.db.users.update(
      { _id: user.id },
      { $inc: { icecream: 1 } },
      { returnUpdatedDocs: true },
      (err, num, updated) => {
        console.log(updated);
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
                  : `${message.author}gave you`
              } some icecream!`
            )
            .setFooter(
              `Now you have ${updated.icecream} icecream${
                updated.icecream === 1 ? '' : 's'
      }! `/* When're you gonna eat ${
                updated.icecream === 1 ? 'it' : 'them'
              }?` */
            )
        );
      }
    );

  // }
};
