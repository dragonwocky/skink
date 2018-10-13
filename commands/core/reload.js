/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'reload',
  description: 'Reloads various bot files.',
  category: 'Core',
  usage: '[config|command|event] [which]',
  cooldown: 3,
  restricted: {
    to: ['279098137484722176']
  }
};

exports.run = (bot, message, data) => {
  // reload bot config/command(s)/event(s)
  if (!message.args[0]) {
    bot.load();
    message.channel.send(
      `:repeat: | **${message.member.nickname ||
        message.author
          .username}**, the config, all events, and all commands have been reloaded.`
    );
  } else {
    if (!['config', 'command', 'event'].includes(message.args[0]))
      return message.channel.send(
        `:x: | **${message.member.nickname || message.author.username}**, - ${
          message.author
        }, the first argument must be either \`config\`, \`command\`, or \`event\`!`
      );
    const load = bot.load(message.args[0], message.args[1]);
    if (load) {
      message.channel.send(
        `:repeat: | **${message.member.nickname ||
          message.author.username}**, ${
          message.args[0] === 'config'
            ? 'the config has'
            : message.args[1]
              ? `the ${message.args[0]} \`${message.args[1]}\` has`
              : `all ${message.args[0]}s have`
        } been reloaded.`
      );
    } else
      message.channel.send(
        `:x: | **${message.member.nickname || message.author.username}**, the ${
          message.args[0]
        } \`${message.args[1]}\` does not exist!`
      );
  }
};
