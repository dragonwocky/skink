/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.trigger = (bot, channel) => {
  if (channel.type !== 'text') return;
  // ensure muted role exists, and is added to the new channel
  const fetchMuted = new Promise((resolve, reject) => {
    const fetchGuild = new Promise((res, rej) => {
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
                res(doc);
              }
            );
          } else res(doc);
        }
      );
    });
    Promise.resolve(fetchGuild).then(guildDB => {
      const role =
        channel.guild.roles.get(guildDB.roles ? guildDB.roles.muted : '') ||
        channel.guild.roles.find(role => role.name.toLowerCase() === 'muted');
      if (
        !role &&
        channel.permissionsFor(bot.client.user.id).has(['MANAGE_ROLES'])
      ) {
        channel.guild
          .createRole({
            name: 'Muted'
          })
          .then(role => {
            Array.from(channel.guild.channels.values()).forEach(chnl =>
              chnl
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
  });
  Promise.resolve(fetchMuted).then(role => {
    if (role) {
      channel
        .overwritePermissions(role, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        })
        .catch(console.error);
      bot.db.guilds.update(
        { _id: channel.guild.id },
        { $set: { 'roles.muted': role.id } },
        {},
        (err, num) => {
          if (err) console.error(err);
        }
      );
    }
  });
};
