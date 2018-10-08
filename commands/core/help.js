/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: 'help',
  aliases: ['info', '?'],
  description: 'Lists all commands and their usages.',
  category: 'Core',
  usage: '[command]',
  cooldown: 3
};

exports.run = (bot, message, data) => {
  const [userDB, guildDB] = data,
    embed = bot.embed();
  if (!message.args.length) {
    // categorize commands
    const categories = {};
    Array.from(bot.cmds.values()).forEach(command => {
      if (!command.meta.restricted || !command.meta.restricted.to) {
        let category = command.meta.category;
        if (!category) category = 'Other';
        if (categories[category]) {
          categories[category].push(command.meta.name);
        } else categories[category] = [command.meta.name];
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
            new RegExp('{PREFIX}'.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            bot.config.prefix
          )
          .replace(
            new RegExp(
              '{GUILDPREFIX}'.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
              'g'
            ),
            guildDB.prefix || bot.config.prefix
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
        ':question: Commands',
        `*To see more information about a command run \`${guildDB.prefix ||
          bot.config.prefix}help [command]\`*\n• ${commands.join('\n• ')}`
      );
  } else {
    // get command
    const command =
      bot.cmds.get(message.args[0].toLowerCase()) ||
      bot.cmds.find(
        cmd =>
          cmd.meta.aliases &&
          cmd.meta.aliases.includes(message.args[0].toLowerCase())
      );
    if (!command)
      return message.channel.send(
        bot
          .embed()
          .setDescription(
            `:x: - ${message.author.username}, the command \`${
              message.args[0]
            }\` does not exist!`
          )
      );
    // send command data: description, aliases, usage, category & permissions
    const info = [];
    if (command.meta.description)
      info.push(`• **Description:** ${command.meta.description}`);
    if (command.meta.aliases)
      info.push(`• **Aliases:** \`${command.meta.aliases.join('`, `')}\``);
    if (command.meta.usage) {
      info.push(
        `• **Usage(s):** \`${(guildDB.prefix || bot.config.prefix) +
          command.meta.name} ${command.meta.usage}\``
      );
    } else
      info.push(
        `• **Usage:** \`${(guildDB.prefix || bot.config.prefix) +
          command.meta.name}\``
      );
    if (command.meta.category)
      info.push(`• **Category:** ${command.meta.category}`);
    if (command.meta.bypass)
      info.push(
        '*This command cannot be disabled, and bypasses channel disables.*'
      );
    if (command.meta.perms && command.meta.perms.user)
      info.push(
        '*You must have the `' +
          `${bot.func.join(
            command.meta.perms.user,
            '`, `',
            '` and `'
          )}\` permission${
            command.meta.perms.user.length === 1 ? '' : 's'
          } to run this command.*`
      );
    if (command.meta.restricted) {
      if (command.meta.restricted.to)
        info.push('*This command is reserved for use only by certain users.*');
      if (command.meta.restricted.from)
        info.push('*You are blocked from using this command.*');
    }
    embed.addField(`:question: ${command.meta.name}`, info.join('\n'));
  }
  if (userDB.prefix && userDB.prefix !== (guildDB.prefix || bot.config.prefix))
    embed.setFooter(
      `Psst, ${message.author.username}, you have a custom prefix:
      you can use ${userDB.prefix} instead of ${guildDB.prefix ||
        bot.config.prefix}`,
      message.author.displayAvatarURL
    );
  message.channel.send(embed);
};
