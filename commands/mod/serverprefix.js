/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'serverprefix',
  description:
    'Sets the prefix for communicating with this bot on this server.',
  category: 'Mod',
  usage: '<prefix>',
  args: 1,
  cooldown: 3,
  moderator: true,
  perms: {
    user: ['MANAGE_GUILD']
  }
};

exports.run = (bot, message, data) => {
  // set guild's custom prefix
  bot.db.guilds.update(
    { _id: message.guild.id },
    { $set: { prefix: message.args[0] } },
    {},
    (err, num) => {
      if (err) console.error(err);
      message.channel.send(
        bot
          .embed()
          .setDescription(
            `:triangular_flag_on_post: - ${
              message.author
            }, the server's prefix has been set to \`${message.args[0]}\``
          )
      );
    }
  );
};
