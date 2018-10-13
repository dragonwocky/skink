/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'stats',
  aliases: ['statistics'],
  description: 'Gives some bot statistics.',
  category: 'Info',
  cooldown: 3
};

exports.run = (bot, message, data) => {
  // sends bot uptime, user/server/channel count, software versions & author
  require('moment-duration-format');
  const version = bot.pack.discord.version,
    duration = bot.pack.moment
      .duration(bot.client.uptime)
      .format('D [days], H [hrs], m [mins], s [secs]');
  message.channel.send(
    bot
      .embed()
      .addField(
        ':bar_chart: Bot Statistics',
        `• **Memory Usage:** ${(
          process.memoryUsage().heapUsed /
          1024 /
          1024
        ).toFixed(2)} MB` +
          `\n• **Uptime:** ${duration}` +
          `\n• **Users:** ${bot.client.users.size.toLocaleString()}` +
          `\n• **Servers:** ${bot.client.guilds.size.toLocaleString()}` +
          `\n• **Channels:** ${bot.client.channels.size.toLocaleString()}` +
          `\n• **Discord.js:** v${version}` +
          `\n• **Node.js:** ${process.version}` +
          `\n• **Author:** <@279098137484722176>`
      )
  );
};
