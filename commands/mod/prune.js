/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'prune',
  description: 'Removes the specified number of messages.',
  usage: '<1-99>',
  category: 'Mod',
  args: 1,
  cooldown: 3,
  moderator: true,
  perms: {
    user: ['MANAGE_MESSAGES'],
    bot: ['MANAGE_MESSAGES']
  }
};

exports.run = (bot, message, data) => {
  // delete requested number of messages
  const amount = parseInt(message.args[0]);
  if (isNaN(amount) || amount < 1 || amount > 99)
    return message.channel.send(
      `:x: | **${message.member.nickname ||
        message.author
          .username}**, the first argument must be a number between 1 and 99!`
    );
  message.channel.bulkDelete(amount + 1, true).catch(err => {
    if (err) console.error(err);
    message.channel.send(
      `:x: | **${message.member.nickname ||
        message.author
          .username}**, an error occured while attempting to prune ${amount} messages:\n\`\`\`${err}\`\`\``
    );
  });
};
