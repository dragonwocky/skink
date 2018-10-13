/*
 * Skink - A multi-purpose bot built with discord.js.
 * =======================================================
 * Copyright (c) 2018 TheDragonRing <thedragonring.bod@gmail.com>, under the MIT License.
 */

exports.meta = {
  name: '8ball',
  description: 'Roll the 8ball, and learn the answer to any yes/no question!',
  category: 'Fun',
  usage: '<question>',
  args: 1,
  cooldown: 3
};

exports.run = (bot, message, data) => {
  // reply with random yes/no/maybe answer
  const answers = [
    'it is certain',
    'it is decidedly so',
    'without a doubt',
    'yes - definitely',
    'you may rely on it',
    'as I see it, yes',
    'most likely',
    'outlook good',
    'yes',
    'signs point to yes',
    'reply hazy, try again',
    'ask again later',
    'better not tell you now',
    'cannot predict now',
    'concentrate and ask again',
    "don't count on it",
    'my reply is no',
    'my sources say no',
    'outlook not so good',
    'very doubtful'
  ];
  message.channel.send(
    `:8ball: | **${message.member.nickname || message.author.username}**, ${
      answers[Math.floor(Math.random() * answers.length)]
    }.`
  );
};
