/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'userinfo',
  aliases: ['user'],
  description: 'Shows information about you or a specified user.',
  usage: '[user]',
  category: 'Info',
  cooldown: 3
};

exports.run = (bot, message, data) => {
  // send user data: account creation/join dates, roles, type, status, nickname, etc.
  const [, guildDB] = data,
    getMember = bot.func.user(bot, message, data, message.args[0]);
  if (getMember) {
    const [member, user, fetchUser] = getMember;
    Promise.resolve(fetchUser).then(userDB => {
      const roles = Array.from(member.roles.values()),
        statuses = {
          online: 'Online',
          idle: 'Idle',
          dnd: 'Do Not Disturb',
          offline: 'Offline'
        };
      let shared = 0;
      bot.client.guilds.every(guild => {
        if (guild.members.has(user.id)) shared++;
      });
      const embed = bot
        .embed()
        .setAuthor(
          `${user.username}#${user.discriminator} (ID: ${user.id})`,
          user.displayAvatarURL
        )
        .setThumbnail(user.displayAvatarURL)
        .addField(
          'Dates',
          `• **Account Creation:** ${bot.pack
            .moment(user.createdAt)
            .format(
              'MMMM Do YYYY, h:mm:ss A [(GMT]Z[)]'
            )}\n• **Join Date:** ${bot.pack
            .moment(member.joinedAt)
            .format('MMMM Do YYYY, h:mm:ss A [(GMT]Z[)]')}`
        );
      if (roles.length)
        embed.addField(`Roles (${roles.length})`, roles.join(', '));
      message.channel.send(
        embed.addField(
          'Other',
          `• **Type:** ${user.bot ? 'Bot' : 'Human'}` +
            `\n• **Nickname:** ${member.nickname ? member.nickname : 'None'}` +
            `\n• **Avatar URL:**  ${user.displayAvatarURL}` +
            `\n• **Status:** ${statuses[user.presence.status]}` +
            `\n• **Balance:** ${userDB.scales} scales${
              userDB.scales === 1 ? '' : 's'
            }` +
            (userDB.prefix &&
            userDB.prefix !== (guildDB.prefix || bot.config.prefix)
              ? `\n• **Custom Prefix (for this bot):** \`${userDB.prefix}\``
              : '') +
            `\n• **Shared Servers (with this bot):** ${shared}`
        )
      );
    });
  } else
    message.channel.send(
      `:x: | **${message.member.nickname ||
        message.author
          .username}**, the first argument must be a valid user from this server!`
    );
};
