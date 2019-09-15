const DBLAPI = require('dblapi.js');
const rp = require('request-promise');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'info';

const db = require('./db/db');
const {
  dbl, streakAmount, maxStreak, updateServer,
  updatePort, username, password,
} = require('../config.json');

const home = `http://${updateServer}:${updatePort}/vote/`;
const discordBots = new DBLAPI(dbl.token, { webhookPort: dbl.port, webhookAuth: dbl.pass });

// webhook logic for posting votes.
discordBots.webhook.on('ready', (hook) => {
  logger.info(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

discordBots.webhook.on('vote', async (vote) => {
  let points = (vote.isWeekend) ? 4000 : 3000;

  // set up new member if needed
  const userInfo = await db.initializeGetUserInfo(vote.user);
  if (!userInfo) return;

  // show the votes and points, account for streaks.
  const streak = (userInfo.streak_vote || 0) + 1;
  points += (streak > 10) ? streakAmount * maxStreak : streakAmount * (streak - 1);

  // points info (streak included now)
  await db.updateUserBankPointsVote(vote.user, points);

  // have not voted for a set amount of time.
  if (streak < 20) {
    logger.info(`${vote.user} has received ${points} points, reset their rolls, and is on a ${streak} day voting streak.`);
    return;
  }

  // only care if they voted a long time so we can record it.
  // send to our server so that they can send it to the appropriate channel.
  await rp({
    uri: home,
    method: 'POST',
    body: JSON.stringify({ userID: vote.user, streak, points }),
    auth: {
      user: username,
      pass: password,
    },
    encoding: null,
    headers: {
      'Content-type': 'application/json',
    },
  });
});

module.exports = discordBots;
