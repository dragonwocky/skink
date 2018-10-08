/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'mod',
  description:
    'Sets the moderator role. Any user with it can run commands in the `Mod` category (excluding this one)' +
    ' regardless of permissions.',
  usage: '<role|current>',
  category: 'Mod',
  args: 1,
  cooldown: 3,
  perms: {
    user: ['MANAGE_GUILD']
  }
};

exports.run = (bot, message, data) => {
  const [, guildDB] = data;
  if (message.args[0] === 'role') {
    // set moderator role
    const role =
      message.guild.roles.get(message.args[0].replace(/\D/g, '')) ||
      message.guild.roles.find(
        role => role.name.toLowerCase() === message.args[0].toLowerCase()
      );
    if (!role)
      return message.channel.send(
        bot
          .embed()
          .setDescription(
            `:x: - ${
              message.author
            }, the first argument must be a valid role of this server!`
          )
      );
    bot.db.guilds.update(
      { _id: message.guild.id },
      { $set: { 'roles.mod': role.id } },
      {},
      (err, num) => {
        if (err) console.error(err);
        message.channel.send(
          bot
            .embed()
            .setDescription(
              `:spy: - ${message.author}, the mod role has been set to ${role}`
            )
        );
      }
    );
  } else {
    if (!message.guild.roles.get(guildDB.mod)) {
      message.channel.send(
        bot
          .embed()
          .setDescription(
            `:spy: - ${message.author}, there is currently no mod role set!`
          )
      );
    } else
      message.channel.send(
        bot
          .embed()
          .setDescription(
            `:spy: - ${
              message.author
            }, the current mod role is ${message.guild.roles.get(guildDB.mod)}`
          )
      );
  }
};
