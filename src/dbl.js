const DBLAPI = require('dblapi.js');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'info';

const { messengerAPI, bongoBotAPI } = require('./services/axios');
const { api, config } = require('./util/constants/paths');

const { streakAmount, maxStreak } = require(config);
const { dbl } = require(api);

const webhookPort = process.env.WEBHOOK_PORT || 30001;
const discordBots = new DBLAPI(dbl.token, { webhookPort, webhookAuth: dbl.pass });

discordBots.webhook.on('ready', (hook) => {
  logger.info(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

discordBots.webhook.on('vote', async (vote) => {
  let points = (vote.isWeekend) ? 4000 : 3000;

  try {
    let { status, data } = await bongoBotAPI.get(`/users/${vote.user}`);
    if (status !== 200 || !data || !data.user) {
      const { status: userStatus, data: userData } = await bongoBotAPI.post('/users', { id: vote.user });
      status = userStatus;
      data = userData;
    }

    const streak = (data.streak_vote || 0) + 1;
    points += (streak > 10) ? streakAmount * maxStreak : streakAmount * (streak - 1);

    await bongoBotAPI.patch(`/users/${vote.user}/points`, { points });

    if (streak < 20) {
      logger.info(`${vote.user} has received ${points} points, reset their rolls, and is on a ${streak} day voting streak.`);
      return;
    }

    await messengerAPI.post('/', { userID: vote.user, streak, points });
  } catch (error) {
    logger.error(error);
  }
});

module.exports = discordBots;
