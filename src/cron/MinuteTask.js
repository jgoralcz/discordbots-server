const { scheduleJob: ScheduleJob } = require('node-schedule');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'error';

const {
  resetRolls, resetClaimsPlebs,
  resetClaimsPatrons, refreshLeaderBoards,
  resetClaimsPatronsTwo, resetRollsPatronsTwo,
  clearStreaks, clearVoteStreaks,
  updateClaimsRollsPatronsWaiting,
  resetAllClientDaily,
} = require('../db/db');

ScheduleJob('minute', '0 * * * * *', async () => {
  // refresh our materialized view
  // update leaderboard every minute,
  // it's like a 50ms query that rarely updates,
  // but there are also a lot of queries to handle.
  await refreshLeaderBoards().catch(logger.error);

  // get our date times.
  const now = new Date();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  // check patron level 2 for the special cases.
  await resetRollsPatronsTwo(minutes).catch(logger.error);
  await resetClaimsPatronsTwo(minutes).catch(logger.error);

  if (minutes !== 0) return;

  await resetRolls().catch(logger.error);
  // clear streaks, more or less lenient every hour.
  await clearStreaks().catch(logger.error);
  await clearVoteStreaks().catch(logger.error);
  // reset the patron level 2 minutes
  await updateClaimsRollsPatronsWaiting().catch(logger.error);

  // third hour we reset claims for normal users.
  if (hours % 3 === 0) {
    await resetClaimsPlebs().catch(logger.error);
  }

  // second hour we reset claims for patrons.
  if (hours % 2 === 0) {
    await resetClaimsPatrons().catch(logger.error);
  }

  // reset all dailies for all users.
  if (hours / 12 === 1) {
    await resetAllClientDaily().catch(logger.error);
  }
});
