const { scheduleJob: ScheduleJob } = require('node-schedule');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'error';

const { bongoBotAPI } = require('../services/axios');

ScheduleJob('minute', '0 * * * * *', async () => {
  const now = new Date();
  const minute = now.getMinutes();
  const hour = now.getHours();

  await bongoBotAPI.patch('/rolls/reset', { minute }).catch(error => logger.error(error));
  await bongoBotAPI.patch('/claims/reset', { hour, minute }).catch(error => logger.error(error));

  if (minute % 10 === 0) {
    // refresh our materialized views
    await bongoBotAPI.put('/leaderboards/refresh').catch(error => logger.error(error));
  }

  if (minute !== 0) return;
  await bongoBotAPI.patch('/guilds/roll-claim-minute').catch(error => logger.error(error));

  // clear streaks, more or less lenient every hour.
  await bongoBotAPI.patch('/users/guilds/streaks/reset').catch(error => logger.error(error));
  await bongoBotAPI.patch('/users/guilds/streaks/votes/reset').catch(error => logger.error(error));

  // reset all dailies for all users.
  if (hour / 12 !== 1) return;

  logger.log('running daily reset...');

  await bongoBotAPI.patch('/users/dailies/reset').catch(error => logger.error(error));
  await bongoBotAPI.delete('/guilds/lastplayed').catch(error => logger.error(error));
  await bongoBotAPI.delete('/guilds/queue').catch(error => logger.error(error));
  await bongoBotAPI.delete('/messages/characters/one-day').catch(error => logger.error(error));
});
