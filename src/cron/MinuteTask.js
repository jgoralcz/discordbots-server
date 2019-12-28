const { scheduleJob: ScheduleJob } = require('node-schedule');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'error';

const { bongoBotAPI } = require('../services/axios');

ScheduleJob('minute', '0 * * * * *', async () => {
  // refresh our materialized view
  // update leaderboard every minute,
  // it's like a 50ms query that rarely updates,
  // but there are also a lot of queries to handle.
  await bongoBotAPI.put('/leaderboards/refresh').catch(error => logger.error(error));

  const now = new Date();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  // check patron level 2 for the special cases.
  await bongoBotAPI.patch('/rolls/patron-two/reset', { minutes }).catch(error => logger.error(error));
  await bongoBotAPI.patch('/claims/patron-two/reset', { minutes }).catch(error => logger.error(error));

  if (minutes !== 0) return;

  await bongoBotAPI.patch('/rolls/reset').catch(error => logger.error(error));
  // clear streaks, more or less lenient every hour.
  await bongoBotAPI.patch('/users/guilds/streaks/reset').catch(error => logger.error(error));
  await bongoBotAPI.patch('/users/guilds/streaks/votes/reset').catch(error => logger.error(error));

  // reset the patron level 2 minutes
  await bongoBotAPI.patch('/guilds/roll-claim-minute').catch(error => logger.error(error));

  // third hour we reset claims for normal users.
  if (hours % 3 === 0) {
    await bongoBotAPI.patch('/claims/plebs/reset').catch(error => logger.error(error));
  }

  // second hour we reset claims for patrons.
  if (hours % 2 === 0) {
    await bongoBotAPI.patch('/claims/patron-one/reset').catch(error => logger.error(error));
  }

  // reset all dailies for all users.
  if (hours / 12 === 1) {
    logger.log('running daily reset...');
    await bongoBotAPI.patch('/users/dailies/reset').catch(error => logger.error(error));
    await bongoBotAPI.delete('/guilds/lastplayed').catch(error => logger.error(error));
    await bongoBotAPI.delete('/guilds/queue').catch(error => logger.error(error));
  }
});
