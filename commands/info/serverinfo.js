/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'serverinfo',
  aliases: ['server'],
  description: "Shows information about the server you're in.",
  category: 'Info',
  cooldown: 3
};

exports.run = (bot, message, data) => {
  const [, guildDB] = data;
  // send server data: owner, name, id, members, channels, roles, creation date, verification level, etc.
  const embed = bot
    .embed()
    .setAuthor(
      `Server Name: ${message.guild.name} (ID: ${message.guild.id})`,
      message.guild.iconURL
    )
    .setThumbnail(message.guild.iconURL);
  let members = 0,
    bots = 0,
    humans = 0,
    online = 0,
    offline = 0,
    idle = 0,
    dnd = 0;
  Array.from(message.guild.members.values()).forEach(member => {
    members++;
    if (member.user.bot) {
      bots++;
    } else humans++;
    if (member.user.presence.status === 'online') online++;
    if (member.user.presence.status === 'offline') offline++;
    if (member.user.presence.status === 'idle') idle++;
    if (member.user.presence.status === 'dnd') dnd++;
  });
  embed.addField(
    `Members (${members})`,
    `• **Humans:** ${humans}` +
      `\n• **Bots:** ${bots}` +
      `\n• **Online:** ${online}` +
      `\n• **Offline:** ${offline}` +
      `\n• **Idle:** ${idle}` +
      `\n• **Do Not Disturb:** ${dnd}`
  );
  let text = [],
    voice = [];
  Array.from(message.guild.channels.values()).forEach(channel => {
    if (channel.type === 'text') text.push(channel);
    if (channel.type === 'voice') voice.push(channel.name);
  });
  if (text.length)
    embed.addField(`Text Channels (${text.length})`, text.join(', '));
  if (voice.length)
    embed.addField(
      `Voice Channels (${voice.length})`,
      `:loud_sound: ${voice.join(', :loud_sound: ')}`
    );
  const roles = Array.from(message.guild.roles.values());
  if (roles.length) embed.addField(`Roles (${roles.length})`, roles.join(', '));
  const levels = [
    'None',
    'Low',
    'Medium',
    '(╯°□°）╯︵ ┻━┻',
    '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
  ];
  message.channel.send(
    embed.addField(
      'Other',
      `• **Server Owner:** ${message.guild.owner.user.username}#${
        message.guild.owner.user.discriminator
      } (ID: ${message.guild.owner.user.id})` +
        `\n• **Guild Prefix (for this bot):** \`${guildDB.prefix ||
          bot.config.prefix}\`` +
        `\n• **Creation Date:** ${bot.pack
          .moment(message.guild.createdAt)
          .format('MMMM Do YYYY, h:mm:ss A [(GMT]Z[)]')}` +
        `\n• **Server Region:** ${message.guild.region}` +
        `\n• **Verification Level:** ${levels[message.guild.verificationLevel]}`
    )
  );
};
