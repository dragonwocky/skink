/*
 * Skink - A multi-purpose Discord bot.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the ISC License.
 */

exports.trigger = async (bot, channel) => {
  if (channel.type !== 0) return;
  const guildDB = await bot.utils.guildDB(channel.guild.id),
    role = channel.guild.roles.get(guildDB.roles.muted);
  if (role && channel.permissionsOf(bot.user.id).has('manageRoles'))
    // 2112 = send messages + add reactions
    channel.editPermission(
      role.id,
      0,
      2112,
      'role',
      'Ensure muted members cannot send messages in this channel.'
    );
};
