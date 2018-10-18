/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

module.exports = {
  name: 'ping',
  description: "Tests this bot's response time.",
  category: 'Core',
  cooldown: 3,
  blocked: [],

  run: (bot, message, data) => {
    // send bot response/ping speeds
    message.channel.send(
      bot
        .embed()
        .addField(
          ':ping_pong: Pong!',
          `• **Response time:** ${new Date().getTime() -
            message.createdTimestamp}ms\n• **Heartbeat (API):** ${Math.round(
            bot.client.ping
          )}ms`
        )
    );
  }
};
