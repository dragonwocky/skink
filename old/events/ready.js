/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.trigger = bot => {
  // set bot profile
  // bot.client.user.setUsername('Skink');
  // bot.client.user.setAvatar('./avatar.png');
  // set bot status from config
  const activity = bot.config.status.value
    .replace(/{PREFIX}/g, bot.config.prefix.general)
    .replace(
      /{SERVERCOUNT}/g,
      `${bot.client.guilds.size.toLocaleString()} server` +
        (bot.client.guilds.size === 1 ? '' : 's')
    );
  bot.client.user.setActivity(activity, {
    type: bot.config.status.type
  });
  // log status
  console.log(bot.func.line(' Ready! ', '=', 0));
};
