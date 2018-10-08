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
  const [, guildDB] = data;
  // send user data: account creation/join dates, roles, type, status, nickname, etc.
  let member, fetchUser;
  if (message.args[0]) {
    member =
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
  } else member = message.member;
  if (!member)
    return message.channel.send(
      bot
        .embed()
        .setDescription(
          `:x: - ${
            message.author
          }, the first argument must be a valid user from this server!`
        )
    );
  const user = member.user;
  if (member.id === message.member.id) {
    fetchUser = data[0];
  } else
    fetchUser = new Promise((resolve, reject) => {
      bot.db.users.findOne({ _id: user.id }, (err, doc) => {
        if (err) console.error(err);
        resolve(doc);
      });
    });
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
          // `\n• **Balance:** ${userDB.balance} Currency${
          //   userDB.balance === 1 ? '' : 's'
          // }` +
          (userDB.prefix &&
          userDB.prefix !== (guildDB.prefix || bot.config.prefix)
            ? `\n• **Custom Prefix (for this bot):** \`${userDB.prefix}\``
            : '') +
          `\n• **Shared Servers (with this bot):** ${shared}`
      )
    );
  });
};
