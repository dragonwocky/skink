/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'mod',
  description:
    'Sets the moderator role (users with it can run moderator commands regardless of permissions).',
  usage: '<role|check|unset>',
  category: 'Mod',
  args: 1,
  cooldown: 3,
  perms: {
    user: ['MANAGE_GUILD']
  }
};

exports.run = (bot, message, data) => {
  const [, guildDB] = data;
  switch (message.args[0]) {
    case 'check':
      if (!message.guild.roles.get(guildDB.mod)) {
        message.channel.send(
          `:spy: | **${message.member.nickname ||
            message.author.username}**, there is currently no mod role set.`
        );
      } else
        message.channel.send(
          `:spy: | **${message.member.nickname ||
            message.author.username}**, the current mod role is **${
            message.guild.roles.get(guildDB.mod).name
          }**.`
        );
      break;

    case 'unset':
      bot.db.guilds.update(
        { _id: message.guild.id },
        { $set: { 'roles.mod': false } },
        {},
        (err, num) => {
          if (err) console.error(err);
          message.channel.send(
            `:spy: | **${message.member.nickname ||
              message.author.username}**, the mod role has been unset.`
          );
        }
      );
      break;

    default:
      // set moderator role
      const role =
        message.guild.roles.get(message.args[0].replace(/\D/g, '')) ||
        message.guild.roles.find(
          role => role.name.toLowerCase() === message.args[0].toLowerCase()
        ) ||
        message.guild.roles.find(
          role =>
            (role.name.toLowerCase()[0] === '@'
              ? role.name.toLowerCase().slice(1)
              : role.name.toLowerCase()) ===
            (message.args[0].toLowerCase()[0] === '@'
              ? message.args[0].toLowerCase().slice(1)
              : message.args[0].toLowerCase())
        );
      if (!role)
        return message.channel.send(
          `:x: | **${message.member.nickname ||
            message.author
              .username}**, the first argument must be a valid role of this server!`
        );
      bot.db.guilds.update(
        { _id: message.guild.id },
        { $set: { 'roles.mod': role.id } },
        {},
        (err, num) => {
          if (err) console.error(err);
          message.channel.send(
            `:spy: | **${message.member.nickname ||
              message.author.username}**, the mod role has been set to **${
              role.name
            }**.`
          );
        }
      );
      break;
  }
};
