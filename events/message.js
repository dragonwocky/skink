/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.trigger = (bot, message) => {
  // respond to direct message using cleverbot.io
  if (message.channel.type === 'dm') {
    if (message.author.bot) return;
    bot.clever.setNick(message.author.username);
    bot.clever.create((err, session) => {
      bot.clever.ask(message.content, (err, response) => {
        if (err) console.error(err);
        message.channel.startTyping();
        setTimeout(() => {
          message.channel.send(response);
          message.channel.stopTyping();
        }, Math.random() * (1 - 3) + 1 * 1000);
      });
    });
  }

  if (message.channel.type === 'text') {
    // ensure message author, guild message was sent from
    // & users mentioned in message are all in database
    const fetchUser = new Promise((resolve, reject) => {
        bot.db.users.findOne({ _id: message.author.id }, (err, doc) => {
          if (err) console.error(err);
          if (!doc) {
            bot.db.users.insert(
              {
                _id: message.author.id,
                icecream: 0,
                scales: 0
              },
              (err, doc) => {
                if (err) console.error(err);
                console.log(
                  `- Added the ${message.author.bot ? 'bot' : 'user'} ${
                    message.author.username
                  }` + ` (ID: ${message.author.id}) to the database.`
                );
                resolve(doc);
              }
            );
          } else
            resolve({
              ...{
                icecream: 0,
                scales: 0
              },
              ...doc
            });
        });
      }),
      fetchGuild = new Promise((resolve, reject) => {
        bot.db.guilds.findOne(
          {
            _id: message.guild.id
          },
          (err, doc) => {
            if (err) console.error(err);
            if (!doc) {
              bot.db.guilds.insert(
                {
                  _id: message.guild.id,
                  disabled: {
                    channels: [],
                    commands: []
                  }
                },
                (err, doc) => {
                  if (err) console.error(err);
                  console.log(
                    `- Added the guild ${message.guild.name}` +
                      ` (ID: ${message.guild.id}) to the database.`
                  );
                  resolve(doc);
                }
              );
            } else
              resolve({
                ...{
                  disabled: {
                    channels: [],
                    commands: []
                  }
                },
                ...doc
              });
          }
        );
      }),
      fetchMentioned = new Promise((resolve, reject) => {
        const mentions = message.content
          .trim()
          .split(/\s+/)
          .map(arg => bot.func.member(message, arg))
          .filter(member => member)
          .map(member => member.user);
        if (mentions.length > 0) {
          Promise.all(
            mentions.map(mentioned => {
              return new Promise((res, rej) => {
                bot.db.users.findOne({ _id: mentioned.id }, (err, doc) => {
                  if (err) console.error(err);
                  if (!doc) {
                    bot.db.users.insert(
                      {
                        _id: mentioned.id,
                        icecream: 0,
                        scales: 0
                      },
                      (err, doc) => {
                        if (err) console.error(err);
                        console.log(
                          `- Added the ${mentioned.bot ? 'bot' : 'user'} ${
                            mentioned.username
                          }` + ` (ID: ${mentioned.id}) to the database.`
                        );
                        res(doc);
                      }
                    );
                  } else
                    res({
                      ...{
                        icecream: 0,
                        scales: 0
                      },
                      ...doc
                    });
                });
              });
            })
          ).then(resolve);
        } else resolve(0);
      });

    Promise.all([fetchUser, fetchGuild, fetchMentioned]).then(data => {
      const [userDB, guildDB] = data;
      // ensure muted role exists
      const fetchMuted = new Promise((resolve, reject) => {
        const role =
          message.guild.roles.get(guildDB.roles ? guildDB.roles.muted : '') ||
          message.guild.roles.find(role => role.name.toLowerCase() === 'muted');
        if (
          !role &&
          message.channel
            .permissionsFor(bot.client.user.id)
            .has(['MANAGE_ROLES'])
        ) {
          message.guild
            .createRole({
              name: 'Muted'
            })
            .then(role => {
              Array.from(message.guild.channels.values()).forEach(channel =>
                channel
                  .overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                  })
                  .catch(console.error)
              );
              resolve(role);
            });
        } else resolve(role);
      });
      Promise.resolve(fetchMuted).then(muted => {
        data[2] = muted;
        const updateMuted = muted
          ? new Promise((resolve, reject) => {
              bot.db.guilds.update(
                { _id: message.guild.id },
                { $set: { 'roles.muted': muted.id } },
                {},
                (err, num) => {
                  if (err) console.error(err);
                  resolve(0);
                }
              );
            })
          : muted;

        Promise.resolve(updateMuted).then(() => {
          // make sure user is human and bot has required basic permissions
          if (
            message.author.bot ||
            !message.channel
              .permissionsFor(bot.client.user.id)
              .has(['SEND_MESSAGES', 'EMBED_LINKS'])
          )
            return;
          const react = emoji => {
            if (
              message.channel
                .permissionsFor(bot.client.user.id)
                .has(['ADD_REACTIONS'])
            )
              message.react(emoji);
          };
          // check if user is using a prefix associated with the bot
          let prefix = guildDB.prefix || bot.config.prefix;
          if (bot.cmds.get('help')) {
            if (
              message.content === bot.config.prefix + 'help' ||
              message.content.startsWith(`${bot.config.prefix}${'help'} `)
            )
              prefix = bot.config.prefix;
            if (bot.cmds.get('help').meta.aliases)
              bot.cmds.get('help').meta.aliases.forEach(alias => {
                if (message.content.startsWith(bot.config.prefix + alias))
                  prefix = bot.config.prefix;
              });
          }
          if (!message.content.startsWith(prefix)) {
            if (message.content.startsWith(userDB.prefix)) {
              prefix = userDB.prefix;
            } else if (message.content.startsWith(`<@${bot.client.user.id}>`)) {
              prefix = `<@${bot.client.user.id}>`;
            } else return;
          }
          // get command
          message.args = message.content
            .slice(prefix.length)
            .trim()
            .split(/\s+/);
          const name = message.args.shift().toLowerCase(),
            cmd =
              bot.cmds.get(name) ||
              bot.cmds.find(
                cmd => cmd.meta.aliases && cmd.meta.aliases.includes(name)
              );
          // message.flags = message.args.filter(arg => arg[0] === '-');
          // check if channel/command is disabled
          if (
            (guildDB.disabled.channels.includes(message.channel.id) ||
              (cmd && guildDB.disabled.commands.includes(cmd.meta.name))) &&
            !cmd.meta.bypass
          )
            return;
          if (!cmd) return;
          // error if command doesn't exist, perms are missing
          // or required arguments are missing
          if (cmd.meta.restricted) {
            if (
              cmd.meta.restricted.to &&
              !cmd.meta.restricted.to.includes(message.author.id)
            )
              return react('❌');
            if (
              cmd.meta.restricted.from &&
              cmd.meta.restricted.from.includes(message.author.id)
            )
              return react('❌');
          }
          if (cmd.meta.perms) {
            if (
              cmd.meta.perms.user &&
              !message.channel
                .permissionsFor(message.author.id)
                .has(cmd.meta.perms.user)
            ) {
              if (cmd.meta.moderator && guildDB.roles) {
                if (!message.member.roles.get(guildDB.roles.mod))
                  return react('❌');
              } else return react('❌');
            }
            if (
              cmd.meta.perms.bot &&
              !message.channel
                .permissionsFor(bot.client.user.id)
                .has(cmd.meta.perms.bot)
            )
              return message.channel.send(
                bot
                  .embed()
                  .setDescription(
                    `:x: - ${message.author}, I need the \`${bot.func.join(
                      cmd.meta.perms.bot,
                      '`, `',
                      '` and `'
                    )}` +
                      `\` permission${
                        cmd.meta.perms.bot.length === 1 ? '' : 's'
                      } for this command to work!`
                  )
              );
          }
          if (cmd.meta.args && message.args.length < cmd.meta.args)
            return message.channel.send(
              bot
                .embed()
                .setDescription(
                  `:x: - Incorrect usage ${message.author}, ${
                    cmd.meta.usage
                      ? `try this: \`${guildDB.prefix || bot.config.prefix}${
                          cmd.meta.name
                        } ${cmd.meta.usage}\``
                      : `run\`${guildDB.prefix || bot.config.prefix}help ${
                          cmd.meta.name
                        }\` to see more info.`
                  }`
                )
            );

          // check cooldowns
          if (!bot.cooldowns) bot.cooldowns = bot.collection();
          if (!bot.cooldowns.has(cmd.meta.name))
            bot.cooldowns.set(cmd.meta.name, bot.collection());
          const now = Date.now(),
            timestamps = bot.cooldowns.get(cmd.meta.name),
            seconds = (cmd.meta.cooldown || 0) * 1000;
          if (!timestamps.has(message.author.id)) {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), seconds);
          } else {
            const expiration = timestamps.get(message.author.id) + seconds,
              timeLeft = (expiration - now) / 1000;
            if (now < expiration) return react('⏱');
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), seconds);
          }
          // run command
          try {
            cmd.run(bot, message, data);
          } catch (err) {
            console.error(err);
            react('❌');
          }
        });
      });
    });
  }
};
