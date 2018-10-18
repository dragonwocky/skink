/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

module.exports = {
  name: 'help',
  aliases: ['info', '?'],
  description: 'Lists all commands and their usages.',
  category: 'Core',
  usage: '[command]',
  cooldown: 3,

  run: (bot, message, data) => {
    const [userDB, guildDB, , type] = data,
      embed = bot.embed(),
      cmds = bot.cmds.filter(
        cmd => (type === 'mod' ? cmd.mod : !cmd.mod) || cmd.name === 'help'
      );
    if (
      type === 'mod' &&
      !message.member.roles.get(guildDB.roles ? guildDB.roles.mod : 0) &&
      !message.channel.permissionsFor(message.author.id).has(['ADMINISTRATOR'])
    ) {
      if (
        message.channel
          .permissionsFor(bot.client.user.id)
          .has(['ADD_REACTIONS'])
      )
        message.react('❌');
      return;
    }
    if (!message.args.length) {
      // categorize commands
      const categories = {};
      Array.from(cmds.values()).forEach(command => {
        if (!command.restricted || !command.restricted.to) {
          let category = command.category;
          if (!category) category = 'Other';
          if (categories[category]) {
            categories[category].push(command.name);
          } else categories[category] = [command.name];
        }
      });
      const commands = Object.keys(categories)
        .sort()
        .map(key => {
          return `**${key}** - \`${categories[key].join('`, `')}\``;
        });
      // send info + command list
      embed
        .addField(
          `${bot.config.emoji} Info`,
          bot.config.info
            .replace(
              new RegExp(
                '{GUILDPREFIX}'.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                'g'
              ),
              guildDB.prefix || bot.config.prefix.general
            )
            .replace(
              new RegExp(
                '{SERVERCOUNT}'.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                'g'
              ),
              `${bot.client.guilds.size.toLocaleString()} server${
                bot.client.guilds.size === 1 ? '' : 's'
              }`
            )
        )
        .addField(
          `:question: ${type[0].toUpperCase() + type.slice(1)} Commands`,
          `*To see more information about a ${type} command run \`${
            type === 'mod'
              ? bot.config.prefix.mod
              : guildDB.prefix || bot.config.prefix.general
          }help [command]\`*\n• ${commands.join('\n• ')}`
        );
    } else {
      // get command
      const command =
        cmds.get(message.args[0].toLowerCase()) ||
        cmds.find(
          cmd =>
            cmd.aliases && cmd.aliases.includes(message.args[0].toLowerCase())
        );
      if (!command)
        return message.channel.send(
          `:x: | **${message.member.nickname ||
            message.author.username}**, the ${type} command \`${
            message.args[0]
          }\` does not exist!`
        );
      // send command data: description, aliases, usage, category & permissions
      const info = [];
      if (command.description)
        info.push(`• **Description:** ${command.description}`);
      if (command.aliases)
        info.push(`• **Aliases:** \`${command.aliases.join('`, `')}\``);
      if (command.usage) {
        info.push(
          `• **Usage(s):** \`${
            command.mod
              ? bot.config.prefix.mod
              : guildDB.prefix || bot.config.prefix.general
          }${command.name} ${command.usage}\``
        );
      } else
        info.push(
          `• **Usage:** \`${
            command.mod
              ? bot.config.prefix.mod
              : guildDB.prefix || bot.config.prefix.general
          }${command.name}\``
        );
      if (command.category) info.push(`• **Category:** ${command.category}`);
      const notices = `\`\`\`${
        command.only
          ? 'This command is reserved for use only by certain users.'
          : ''
      }\n${
        command.blocked.includes(message.author.id)
          ? 'You are blocked from using this command.'
          : ''
      }\`\`\``;
      if (notices !== '```\n```') info.push(notices);
      embed.addField(`:question: ${command.name}`, info.join('\n'));
    }
    if (
      userDB.prefix &&
      userDB.prefix !== (guildDB.prefix || bot.config.prefix.general) &&
      !command.mod
    )
      embed.setFooter(
        `Psst, **${message.author.username}**, you have a custom prefix:
      you can use ${userDB.prefix} instead of ${guildDB.prefix ||
          bot.config.prefix.general}`,
        message.author.displayAvatarURL
      );
    message.channel.send(embed);
  }
};
