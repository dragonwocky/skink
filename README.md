# Skink

A multi-purpose [Discord](https://discordapp.com) bot built with [Eris](https://abal.moe/Eris).

- A config file contains various settings for the bot, including customising the bot's status.
- A few base commands and some extra fun commands.
- A couple of owner-only commands for managing/testing the bot.
- Prefix customisation: serverwide and per-user. Bot also responds to messages prefixed by mentioning it.
- A set of moderation and configuration commands that use a separate prefix to the .
- Cleverbot implementation: chat in DMs or with a command.
- A basic economy system to allow for future features that will make use of the currency.

#### General Commands

Default General Prefix: `--`

| Name         | Description                                                    | Aliases         | Usage (`<required> [optional]`)           | Category |
| ------------ | -------------------------------------------------------------- | --------------- | ----------------------------------------- | -------- |
| `help`       | Lists all commands and their usages.                           | `info`, `?`     | `help [command]`                          | Core     |
| `invite`     | Gives a link to invite this bot to another server.             |                 | `invite`                                  | Core     |
| `ping`       | Tests this bot's response time.                                |                 | `ping`                                    | Core     |
| `eval`       | Executes inputted JS. Can only be run by the bot's owner.      |                 | `eval <js>`                               | Core     |
| `reload`     | Reloads various bot files. Can only be run by the bot's owner. |                 | `reload [config\|command\|event] [which]` | Core     |
| `8ball`      | Roll the 8ball, and learn the answer to any yes/no question!   |                 | `8ball <question>`                        | Fun      |
| `icecream`   | I scream for icecream!                                         |                 | `icecream [user\|check\|eat]`             | Fun      |
| `talk`       | Talk to the bot.                                               | `chat`, `t`     | `talk <message>`                          | Fun      |
| `stats`      | Gives some bot statistics.                                     | `statistics`    | `stats`                                   | Info     |
| `serverinfo` | Shows information about the server you're in.                  | `server`        | `serverinfo`                              | Info     |
| `userinfo`   | Shows information about you or a specified user.               | `user`          | `userinfo`                                | Info     |
| `balance`    | Displays how many scales you or another user has.              | `bal`, `scales` | `balance [user]`                          | Economy  |
| `transfer`   | Transfers the specified number of scales to another user.      | `pay`           | `transfer <user> <amount>`                | Economy  |
| `daily`      | Collects or grants scales (can only be used once a day).       |                 | `daily [user]`                            | Economy  |
| `userprefix` | Sets your personal prefix for communicating with this bot.     | `prefix`        | `userprefix <prefix>`                     | Utils    |

#### Mod Commands

Default Mod Prefix: `%%`

| Name           | Description                                                     | Aliases | Usage (`<required> [optional]`)           | Category          |
| -------------- | --------------------------------------------------------------- | ------- | ----------------------------------------- | ----------------- |
| `mod`          | Sets the moderator role.                                        |         | `mod <role\|check\|unset>`                | Configuration     |
| `channel`      | Enables or disables use of the bot in a certain channel.        |         | `channel <enable\|disable\|list> [which]` | Configuration     |
| `command`      | Enables or disables use of a certain command in this server.    |         | `channel <enable\|disable\|list> [which]` | Configuration     |
| `serverprefix` | Sets the prefix for communicating with this bot on this server. |         | `serverprefix <prefix>`                   | Configuration     |
| `ban`          | Bans a user for a specified reason.                             |         | `ban <user> [reason`                      | Server Management |
| `pardon`       | Pardons (unbans) a user for a specified reason.                 | `unban` | `pardon <user> [reason]`                  | Server Management |
| `kick`         | Kicks a user for a specified reason.                            |         | `kick <user> [reason]`                    | Server Management |
| `mute`         | Mutes a user.                                                   |         | `mute <user> [seconds]`                   | Server Management |
| `unmute`       | Unmutes a user.                                                 |         | `unmute <user>`                           | Server Management |
| `prune`        | Removes the specified number of messages.                       |         | `prune <1-99>`                            | Server Management |

_These commands can only be run by users with the `ADMINISTRATOR` permission or users with the role set by the `mod` command._

#### Required Permissions

- `VIEW_CHANNEL` (Read Messages), `SEND_MESSAGES`, `EMBED_LINKS` & `ADD_REACTIONS`: for responding to commands.
- `MANAGE_ROLES`: for muting/unmuting users.
- `MANAGE_MESSAGES`: for deleting messages with the `prune` command.
- `BAN_MEMBERS`: for banning users with the `ban` command and unbanning them with the `pardon` command.
- `KICK_MEMBERS`: for banning users with the `kick` command.

#### Feature Ideas (aka TODO list)

- Rooms: when enabled by mods, users can run `room` and create a channel in a set category named after them, having complete moderation over that channel.
- Voting system: round 1, register by voting; round 2, optionally change vote (if wanting to vote for winners).
- Games: Hangman, Noughts & Crosses, Connect4, Battles.
- Mod logging.
- Tags (custom commands).
- Ranks/experience system. Including decay, roles based on position not just level, maybe way to "battle" other users for their xp?
- Starboard (add x starred msgs to x channel).
- Pets.

### Known Issues

- Cleverbot responds too slowly.
- Only up to 99 messages can be pruned each time.
- Custom user prefixes are global, not per-server. Is this good or bad?
- Issues with `blocked`.

### Contributing

If you notice any bugs, please open an issue with information about what happened (or what didn't happen) and why (what you tried to do and how you tried to do it). Contributions in the form of pull requests for new features or improvements to existing features are welcome.

_Skink is licensed under the MIT License (see the [LICENSE](LICENSE) file)._

---

#### Config

```js
{
  "prefix": {
    "general": "--",
    "mod": "%%"
  },
  // used in the help message
  "emoji": "🦎",
  "info": "Shown in the help message. Available tags are {GUILDPREFIX} (custom prefix set by command for a guild) and {SERVERCOUNT} (example: 37 servers).",
  "invite": "https://discordapp.com/oauth2/authorize?client_id=&scope=bot&permissions=",
  // decimal colour - below is https://www.colorhexa.com/b3000a
  "embedColour": 11730954,
  "status": {
    // available: 0 (Playing), 2 (Listening to) and 3 (Watching)
    "type": 3,
    // available: {SERVERCOUNT} (example: 37 servers)
    "value": "for --help | {SERVERCOUNT}"
  },
  "cleverUser": "(cleverbot.io)",
  "cleverKey": "(cleverbot.io)",
  "TOKEN": "(discord)"
}
```

#### Command Template

```js
// file: ./commands/example.js

module.exports = {
  name: 'example',
  aliases: false,
  description: 'Does something.',
  category: 'General',
  // string: '<required> [optional]'
  usage: false,
  // string: 'example @user bcos why not'
  example: false,
  // required arg count - number: 1
  args: false,
  // in seconds
  cooldown: 3,
  // permissions required by the bot to run command (https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)
  perms: [],
  // only users with the mod role can run this command
  mod: false,
  // user IDs blocked from running this command
  blocked: []
  // if value: only these user IDs can run this command
  only: []
  
  run: (bot, message, data) => {
    // do stuff
    // data = [userDB, guildDB, mentionedUserDBs, type (general|mod), mutedRole]
  };
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
bot // the eris client object (extension of eventEmitter)
{
  utils {
    line(string, char, where) = // underlines string, overlines string or does both
    join(array, char, word) = // formats joining array, usually used with commas and a word like "and" or "or"
    foreachAsync(array, callback) = // async-ifies JS's built-in forEach
    flatten(array) = // flattens array
    promisifyAll(object, keys = Object.getOwnPropertyNames(object)) = // convert all or specified callbacks of object methods to promises
    walk(dir) = // recusively read directory contents
    guildDB(id) = // returns guild database (creates it if neccessary)
    userDB(id) = // returns user database (creates it if neccessary)
  }
  db {
    users = // user database - see below
    guilds = // guild database - see below
  }
  load() = // manages loading/reloading the config, all commands & all events
  collection() = // returns new collection (extension of map)
  config = // returns data from config.json
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
    roles {
      mod = // users with this role can run moderation commands
      muted = // the role used to mute users
    }
    prefix = // custom guild prefix for general commands
  }
]

users [
  {
    _id = // user ID
    prefix = // custom user prefix for general commands
    scales = // scale balance (credits/tokens)
    icecream = // number of icecreams from icecream command
    daily = // time user last ran daily command successfully
  }
]
```
