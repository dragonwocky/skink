/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports = {
  name: 'channel',
  description: 'Enables or disables use of the bot in a certain channel.',
  usage: '<enable|disable|list> [which]',
  category: 'Mod',
  args: 1,
  cooldown: 3,
  restricted: {
    mod: true
  }
};

exports.run = (bot, message, data) => {
  const [, guildDB] = data;
  if (!['enable', 'disable', 'list'].includes(message.args[0]))
    return message.channel.send(
      `:x: | **${message.member.nickname ||
        message.author
          .username}**, the first argument must be either \`enable\`, \`disable\`, or \`list\`!`
    );
  let channel;
  if (message.args[1]) {
    const ID = message.args[1].replace(/\D/g, '');
    channel =
      message.guild.channels.get(message.args[0].replace(/\D/g, '')) ||
      message.guild.channels.find(
        channel => channel.name.toLowerCase() === message.args[0].toLowerCase()
      );
    if (!channel)
      return message.channel.send(
        `:x: | **${message.member.nickname ||
          message.author
            .username}**, the second argument must be a valid channel in this server!`
      );
  } else channel = message.channel;

  switch (message.args[0]) {
    case 'enable':
      // enable bot in channel
      bot.db.guilds.update(
        { _id: message.guild.id },
        { $pull: { 'disabled.channels': channel.id } },
        {},
        (err, num) => {
          if (err) console.error(err);
          message.channel.send(
            `:eye: | **${message.member.nickname ||
              message.author.username}**, the bot is enabled in ${channel}`
          );
        }
      );
      break;

    case 'disable':
      // disable bot in channel
      bot.db.guilds.update(
        { _id: message.guild.id },
        { $addToSet: { 'disabled.channels': channel.id } },
        {},
        (err, num) => {
          if (err) console.error(err);
          message.channel.send(
            `:sleeping: | **${message.member.nickname ||
              message.author.username}**, the bot is disabled in ${channel}`
          );
        }
      );
      break;

    case 'list':
      // list enabled/disabled channels
      let enabled = [],
        disabled = [];
      Array.from(message.guild.channels.values()).forEach(channel => {
        if (channel.type === 'text') {
          const ID = channel.id;
          if (guildDB.disabled.channels.includes(ID)) {
            disabled.push(channel);
          } else enabled.push(channel);
        }
      });
      let embed = bot.embed();
      if (enabled.length)
        embed.addField(
          `:eye: Enabled Channels (${enabled.length})`,
          enabled.join(', ')
        );
      if (disabled.length)
        embed.addField(
          `:sleeping: Disabled Channels (${disabled.length})`,
          disabled.join(', ')
        );
      message.channel.send(embed);
      break;
  }
};
