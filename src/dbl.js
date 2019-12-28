const DBLAPI = require('dblapi.js');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'info';

const { messengerAPI, bongoBotAPI } = require('./services/axios');

const { dbl, streakAmount, maxStreak } = require('../config.json');

const discordBots = new DBLAPI(dbl.token, { webhookPort: dbl.port, webhookAuth: dbl.pass });

discordBots.webhook.on('ready', (hook) => {
  logger.info(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

discordBots.webhook.on('vote', async (vote) => {
  let points = (vote.isWeekend) ? 4000 : 3000;

  try {
    let { status, data } = await bongoBotAPI.get(`/users/${vote.user}`);
    if (status !== 200 || !data) {
      const result = await bongoBotAPI.post('/users', { id: vote.user });
      status = result.status;
      data = result.data;
    }

    const streak = (data.streak_vote || 0) + 1;
    points += (streak > 10) ? streakAmount * maxStreak : streakAmount * (streak - 1);

    await bongoBotAPI.patch(`/users/${vote.user}/points`, { points });

    if (streak < 20) {
      logger.info(`${vote.user} has received ${points} points, reset their rolls, and is on a ${streak} day voting streak.`);
      return;
    }

    await messengerAPI.post('/votes', { userID: vote.user, streak, points });
  } catch (error) {
    logger.error(error);
  }
});

module.exports = discordBots;
