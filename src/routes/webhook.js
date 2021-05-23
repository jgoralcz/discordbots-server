const route = require('express-promise-router')();
const { Webhook } = require(`@top-gg/sdk`);
const log4js = require('log4js');

const { messengerAPI, bongoBotAPI } = require('./services/axios');
const { api, config } = require('./util/constants/paths');
const { streakAmount, maxStreak } = require(config);
const { dbl } = require(api);

const logger = log4js.getLogger();
logger.level = 'info';

const wh = new Webhook(dbl.pass);

route.post('/', wh.listener(vote => {
  console.log('vote', vote);
  let points = (vote.isWeekend) ? 4000 : 3000;

  try {
    let { status, data } = await bongoBotAPI.get(`/users/${vote.user}`);
    if (status !== 200 || !data || !data.userId) {
      const { status: userStatus, data: userData } = await bongoBotAPI.post('/users', { id: vote.user });
      status = userStatus;
      data = userData;
    }

    const streak = (data.streak_vote || 0) + 1;
    points += (streak > 10) ? streakAmount * maxStreak : streakAmount * (streak - 1);

    await bongoBotAPI.patch(`/users/${vote.user}/points`, { points });

    if (streak < 20) {
      logger.info(`${vote.user} has received ${points} points, added roles, and is on a ${streak} day voting streak.`);
      return;
    }

    await messengerAPI.post('/votes', { userID: vote.user, streak, points });
  } catch (error) {
    logger.error(error);
  }
}));

module.exports = route;
