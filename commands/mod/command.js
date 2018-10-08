/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'command',
  description: 'Enables or disables use of a certain command in this server.',
  usage: '<enable|disable|list> [which]',
  category: 'Mod',
  args: 1,
  cooldown: 3,
  bypass: true,
  moderator: true,
  perms: {
    user: ['MANAGE_CHANNELS']
  }
};

exports.run = (bot, message, data) => {
  const [, guildDB] = data;
  if (!['enable', 'disable', 'list'].includes(message.args[0]))
    return message.channel.send(
      bot
        .embed()
        .setDescription(
          `:x: - ${
            message.author
          }, the first argument must be either \`enable\`, \`disable\` or \`list\`!`
        )
    );
  const command =
    bot.cmds.get(message.args[1]) ||
    bot.cmds.find(
      cmd => cmd.meta.aliases && cmd.meta.aliases.includes(message.args[1])
    );
  if (message.args[0] !== 'list' && !command)
    return message.channel.send(
      bot.embed().setDescription(
        `:x: - ${message.author}, ${
          message.args[1]
            ? `the command \`${
                message.args[1]
              }\` does not exist! Run \`${guildDB.prefix ||
                bot.config.prefix}help\` to see a list.`
            : `which command would you like to ${
                message.args[0]
              }? Try running \`${guildDB.prefix || bot.config.prefix}command ${
                message.args[0]
              } <command>\`
          `
        }`
      )
    );

  switch (message.args[0]) {
    case 'enable':
      // enable command in guild
      bot.db.guilds.update(
        { _id: message.guild.id },
        { $pull: { 'disabled.commands': command.meta.name } },
        {},
        (err, num) => {
          if (err) console.error(err);
          message.channel.send(
            bot
              .embed()
              .setDescription(
                `:eye: - ${message.author}, the command \`${
                  command.meta.name
                }\` is enabled in this server.`
              )
          );
        }
      );
      break;
    case 'disable':
      if (command.meta.bypass)
        return message.channel.send(
          bot
            .embed()
            .setDescription(
              `:x: - ${message.author}, the command \`${
                message.args[1]
              }\` cannot be disabled!`
            )
        );
      // disable command in guild
      bot.db.guilds.update(
        { _id: message.guild.id },
        { $addToSet: { 'disabled.commands': command.meta.name } },
        {},
        (err, num) => {
          if (err) console.error(err);
          message.channel.send(
            bot
              .embed()
              .setDescription(
                `:sleeping: - ${message.author}, the command \`${
                  command.meta.name
                }\` is disabled in this server.`
              )
          );
        }
      );
      break;
    case 'list':
      let enabled = [],
        disabled = [];
      Array.from(bot.cmds.values()).forEach(cmd => {
        if (guildDB.disabled.commands.includes(cmd.meta.name)) {
          disabled.push(cmd.meta.name);
        } else enabled.push(cmd.meta.name);
      });
      let embed = bot.embed();
      if (enabled.length)
        embed.addField(
          `:eye: Enabled Commands (${enabled.length})`,
          `\`${enabled.join('`, `')}\``
        );
      if (disabled.length)
        embed.addField(
          `:sleeping: Disabled Commands (${disabled.length})`,
          `\`${disabled.join('`, `')}\``
        );
      message.channel.send(embed);
      break;
  }
};
