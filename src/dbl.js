const DBLAPI = require('dblapi.js');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'info';

const { updateUserBankPointsVote, initializeGetUserInfo } = require('./db/db');
const { messengerAPI } = require('./services/axios');

const { dbl, streakAmount, maxStreak } = require('../config.json');

const discordBots = new DBLAPI(dbl.token, { webhookPort: dbl.port, webhookAuth: dbl.pass });

discordBots.webhook.on('ready', (hook) => {
  logger.info(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

discordBots.webhook.on('vote', async (vote) => {
  let points = (vote.isWeekend) ? 4000 : 3000;

  const userInfo = await initializeGetUserInfo(vote.user);
  if (!userInfo) {
    logger.error(`User doesn't exist ${vote.user}`);
    return;
  }

  const streak = (userInfo.streak_vote || 0) + 1;
  points += (streak > 10) ? streakAmount * maxStreak : streakAmount * (streak - 1);

  await updateUserBankPointsVote(vote.user, points);

  if (streak < 20) {
    logger.info(`${vote.user} has received ${points} points, reset their rolls, and is on a ${streak} day voting streak.`);
    return;
  }

  await messengerAPI.post('/', { userID: vote.user, streak, points });
});

module.exports = discordBots;
