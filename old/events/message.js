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
                  }#${mentioned.tag} (ID: ${
                    message.author.id
                  }) to the database.`
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
                    `- Added the guild ${message.guild.name} (ID: ${
                      message.guild.id
                    }) to the database.`
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
                          }#${mentioned.tag} (ID: ${
                            mentioned.id
                          }) to the database.`
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
          ).then(data => {
            const mentioned = bot.collection();
            data.forEach(db => mentioned.set(db._id, db));
            resolve(mentioned);
          });
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
          const prefixes = [
            guildDB.prefix,
            userDB.prefix,
            bot.config.prefix.general,
            bot.config.prefix.mod,
            `<@${bot.client.user.id}>`
          ];
          let prefix;
          prefixes.forEach(pre => {
            if (message.content.startsWith(pre)) prefix = pre;
          });
          if (message.content.startsWith(`${bot.config.prefix}help`))
            prefix = bot.config.prefix;
          if (bot.cmds.get('help').aliases)
            bot.cmds.get('help').aliases.forEach(alias => {
              if (message.content.startsWith(bot.config.prefix + alias))
                prefix = bot.config.prefix;
            });
          if (!prefix) return;
          // get command
          message.args = message.content
            .slice(prefix.length)
            .trim()
            .split(/\s+/);
          // message.flags = message.args.filter(arg => arg[0] === '-');
          const name = message.args.shift().toLowerCase(),
            command =
              bot.cmds.get(name) ||
              bot.cmds.find(cmd => cmd.aliases && cmd.aliases.includes(name));
          if (!command) return;
          let type = 'general';

          // permission checking:
          // - distinguish between mod commands and general commands
          // - check bot has perms to run command
          // - check if command is disabled
          // - check if command is restricted to or from user
          if (
            (command.only && !command.only.includes(message.author.id)) ||
            (comand.blocked && comand.blocked.includes(message.author.id))
          )
            return react('❌');
          if (prefix === bot.config.prefix.mod) type = 'mod';
          if (command.mod) {
            if (prefix === `<@${bot.client.user.id}>`) type = 'mod';
            if (type !== 'mod') return;
            if (
              !message.member.roles.get(
                guildDB.roles ? guildDB.roles.mod : 0
              ) &&
              !message.channel
                .permissionsFor(message.author.id)
                .has(['ADMINISTRATOR'])
            )
              return react('❌');
          } else {
            if (type === 'mod' && command.name !== 'help') return;
            if (
              guildDB.disabled &&
              ((guildDB.disabled.channels
                ? guildDB.disabled.channels
                : []
              ).includes(message.channel.id) ||
                (guildDB.disabled.commands
                  ? guildDB.disabled.commands
                  : []
                ).includes(command ? command.name : 0))
            )
              return;
            if (
              command.perms &&
              !message.channel
                .permissionsFor(bot.client.user.id)
                .has(command.perms)
            )
              return message.channel.send(
                `:x: | **${message.member.nickname ||
                  message.author.username}**, I need the \`${bot.func.join(
                  command.perms,
                  '`, `',
                  '` and `'
                )}\` permission${
                  command.perms.length === 1 ? '' : 's'
                } for this command to work!`
              );
          }

          // check if command arguments are missing
          if (command.args && message.args.length < command.args)
            return message.channel.send(
              `:x: | **${message.member.nickname ||
                message.author.username}**, incorrect usage - ${
                command.usage
                  ? `try this: \`${
                      type === 'mod'
                        ? bot.config.prefix.mod
                        : guildDB.prefix || bot.config.prefix.general
                    }${command.name} ${command.usage}\``
                  : `run \`${
                      type === 'mod'
                        ? bot.config.prefix.mod
                        : guildDB.prefix || bot.config.prefix.general
                    }help ${command.name}\` to see more info.`
              }`
            );

          // check cooldowns
          if (!bot.cooldowns) bot.cooldowns = bot.collection();
          if (!bot.cooldowns.has(command.name))
            bot.cooldowns.set(command.name, bot.collection());
          const now = Date.now(),
            timestamps = bot.cooldowns.get(command.name),
            seconds = (command.cooldown || 0) * 1000;
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
          data.push(type, muted);
          try {
            command.run(bot, message, data);
          } catch (err) {
            console.error(err);
            react('❌');
          }
        });
      });
    });
  }
};
