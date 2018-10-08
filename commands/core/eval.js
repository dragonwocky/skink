/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'eval',
  description: 'Executes inputted JS.',
  category: 'Core',
  usage: '<js>',
  args: 1,
  cooldown: 3,
  restricted: {
    to: ['279098137484722176']
  }
};

exports.run = (bot, message, data) => {
  const code = message.args.join(' '),
    embed = bot
      .embed()
      .addField(
        ':inbox_tray: Input:',
        `\`\`\`${code.replace(/`/g, '\\`').replace(/@/g, '\\@')}\`\`\``
      );
  try {
    // evaluate (run) code (input)
    const output = require('util').inspect(eval(code));
    embed.addField(
      ':outbox_tray: Output (success):',
      `\`\`\`${output.replace(/`/g, '\\`').replace(/@/g, '\\@')}\`\`\``
    );
  } catch (error) {
    // send back error
    embed.addField(
      ':outbox_tray: Output (error):',
      `\`\`\`${error
        .toString()
        .replace(/`/g, '\\`')
        .replace(/@/g, '\\@')}\`\`\``
    );
  }
  message.channel.send(embed);
};
