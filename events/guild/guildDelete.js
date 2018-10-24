/*
 * Skink - A multi-purpose Discord bot.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the ISC License.
 */

exports.trigger = async (bot, guild) => {
  bot.editStatus('online', {
    name: bot.config.status.value.replace(
      /{SERVERCOUNT}/g,
      `${bot.guilds.size.toString()} server` +
        (bot.guilds.size === 1 ? '' : 's')
    ),
    type: bot.config.status.type
  });
  console.log(`- Left the guild ${guild.name} (ID: ${guild.id}).`);
};
