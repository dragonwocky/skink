# Skink

A multi-purpose bot built with [discord.js](https://discord.js.org).

- A config file contains various settings for the bot, including customising the bot's status.
- A few base commands.
- A couple of owner-only commands for managing/testing the bot.
- Prefix customisation: serverwide and per-user.
- A set of moderation commands.
- Cleverbot implementation: chat in DMs or with a command.
- A couple of extra, fun commands.
- A basic economy system to allow for future features that will make use of the currency.

### Commands

| Name           | Description                                                                                   | Aliases         | Usage (`<required> [optional]`)           | Category |
| -------------- | --------------------------------------------------------------------------------------------- | --------------- | ----------------------------------------- | -------- |
| `help`         | Lists all commands and their usages.                                                          | `info`, `?`     | `help [command]`                          | Core     |
| `invite`       | Gives a link to invite this bot to another server.                                            |                 | `invite`                                  | Core     |
| `ping`         | Tests this bot's response time.                                                               |                 | `ping`                                    | Core     |
| `eval`         | Executes inputted JS. Can only be run by the bot's owner.                                     |                 | `eval <js>`                               | Core     |
| `reload`       | Reloads various bot files. Can only be run by the bot's owner.                                |                 | `reload [config\|command\|event] [which]` | Core     |
| `8ball`        | Roll the 8ball, and learn the answer to any yes/no question!                                  |                 | `8ball <question>`                        | Fun      |
| `icecream`     | I scream for icecream!                                                                        |                 | `icecream [user\|check\|eat]`             | Fun      |
| `talk`         | Talk to the bot.                                                                              | `chat`, `t`     | `talk <message>`                          | Fun      |
| `stats`        | Gives some bot statistics.                                                                    | `statistics`    | `stats`                                   | Info     |
| `serverinfo`   | Shows information about the server you're in.                                                 | `server`        | `serverinfo`                              | Info     |
| `userinfo`     | Shows information about you or a specified user.                                              | `user`          | `userinfo`                                | Info     |
| `balance`      | Displays how many scales you or another user has.                                             | `bal`, `scales` | `balance [user]`                          | Economy  |
| `transfer`     | Transfers the specified number of scales to another user.                                     | `pay`           | `transfer <user> <amount>`                | Economy  |
| `daily`        | Collects or grants scales (can only be used once a day).                                      |                 | `daily [user]`                            | Economy  |
| `mod`          | Sets the moderator role (users with it can run moderator commands regardless of permissions). |                 | `mod <role\|check\|unset>`                | Mod      |
| `ban`          | Bans a user for a specified reason.                                                           |                 | `ban <user> [reason`                      | Mod      |
| `pardon`       | Pardons (unbans) a user for a specified reason.                                               | `unban`         | `pardon <user> [reason]`                  | Mod      |
| `kick`         | Kicks a user for a specified reason.                                                          |                 | `kick <user> [reason]`                    | Mod      |
| `channel`      | Enables or disables use of the bot in a certain channel.                                      |                 | `channel <enable\|disable\|list> [which]` | Mod      |
| `command`      | Enables or disables use of a certain command in this server.                                  |                 | `channel <enable\|disable\|list> [which]` | Mod      |
| `mute`         | Mutes a user.                                                                                 |                 | `mute <user> [seconds]`                   | Mod      |
| `unmute`       | Unmutes a user.                                                                               |                 | `unmute <user>`                           | Mod      |
| `prune`        | Removes the specified number of messages.                                                     |                 | `prune <1-99>`                            | Mod      |
| `serverprefix` | Sets the prefix for communicating with this bot on this server.                               |                 | `serverprefix <prefix>`                   | Mod      |
| `userprefix`   | Sets your personal prefix for communicating with this bot.                                    | `prefix`        | `userprefix <prefix>`                     | Utils    |

#### Required Permissions

- `VIEW_CHANNEL` (Read Messages), `SEND_MESSAGES`, `EMBED_LINKS` & `ADD_REACTIONS`: for responding to commands.
- `MANAGE_ROLES`: for muting/unmuting users.
- `MANAGE_MESSAGES`: for deleting messages with the `prune` command.
- `BAN_MEMBERS`: for banning users with the `ban` command and unbanning them with the `pardon` command.
- `KICK_MEMBERS`: for banning users with the `kick` command.

#### Feature Ideas (aka TODO list)

- Rooms: when enabled by mods, users can run `room` and create a channel in a set category named after them, having complete moderation over that channel.
- Games: Hangman, Noughts & Crosses, Connect4, Battles.
- Tags (custom commands).
- Ranks/experience system. Including decay, roles based on position not just level, maybe way to "battle" other users for their xp?
- Starboard (add x starred msgs to x channel).
- Pets.

### Known Issues

- Cleverbot responds too slowly.
- Only up to 99 messages can be pruned each time.
- Custom user prefixes are global, not per-server. Is this good or bad?

### Contributing

If you notice any bugs, please open an issue with information about what happened (or what didn't happen) and why (what you tried to do and how you tried to do it). Contributions in the form of pull requests for new features or improvements to existing features are welcome.

_Skink is licensed under the MIT License (see the [LICENSE](LICENSE) file)._

---

#### Config

```js
{
  "prefix": "..",
  // used in the help message
  "emoji": "🦎",
  "info": "Shown in the help message. Available tags are {PREFIX} (prefix set above), {GUILDPREFIX} (custom prefix set by command for a guild), and {SERVERCOUNT} (example: 37 servers).",
  "invite": "https://discordapp.com/oauth2/authorize?client_id=&scope=bot&permissions=",
  // decimal colour - below is https://www.colorhexa.com/b3000a
  "embedColour": 11730954,
  "status": {
    // available: PLAYING (Playing), LISTENING (Listening to) and WATCHING (Watching)
    "type": "WATCHING",
    // available: {PREFIX} (prefix set above) and {SERVERCOUNT} (example: 37 servers)
    "value": "for {PREFIX}help | {SERVERCOUNT}"
  },
  "cleverUser": "cleverbot.io API User",
  "cleverKey": "cleverbot.io API Key",
  "TOKEN": "discord bot token"
}
```

#### Command Template

```js
// file: ./commands/example.js

exports.meta = {
  name: 'example',
  aliases: false,
  description: 'Does something.',
  category: 'General',
  // string: '<required> [optional]'
  usage: false,
  // required arg count - number: 1
  args: false,
  // in seconds
  cooldown: 3,
  // force command perma-enabled
  bypass: false,
  // users with the mod role can run this command regardless of user perms
  moderator: false,
  // permissions required to run command (https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)
  perms: {
    user: [],
    bot: []
  },
  restricted: {
    // if value: **only** these user IDs can run this command
    to: [],
    // user IDs blocked from running this command
    from: []
  }
};

exports.run = (bot, message, data) => {
  // do stuff
};
```

#### Event Template

```js
// file: ./events/eventName.js

exports.trigger = (bot, arg1, arg2, etc) => {
  // do stuff
};
```

#### API

```js
bot {
  func {
    line() = // underlines string, overlines string or does both
    join() = // formats joining array, usually used with commas and a word like "and" or "or"
    user() = // returns member from search or sender with data
    member() = // returns member from search
  }
  pack {
    discord = // the discord.js package
    moment = // the moment.js package
  }
  db {
    users = // user database - see below
    guilds = // guild database - see below
  }
  clever = // the cleverbot.io package (initialised and signed into)
  load() = // manages loading/reloading the config, all commands & all events
  embed() = // returns new pre-formatted embed
  collection() = // returns new collection (extension of map)
  config = // returns data from config.json
  client = // returns discord client object (extension of eventEmitter)
  cmds = // returns all loaded commands
  cooldowns = // returns current user command cooldowns
}
```

#### Database

```js
guilds [
  {
    _id = // guild ID
    disabled {
      channels = // array of disabled channel IDs
      commands = // array of disabled command names
    }
    prefix = // custom guild prefix
  }
]

users [
  {
    _id = // user ID
    prefix = // custom user prefix
    scales = // scale balance (credits/tokens)
    icecream = // number of icecreams from icecream command
    daily = // time user last ran daily command successfully
  }
]
```
