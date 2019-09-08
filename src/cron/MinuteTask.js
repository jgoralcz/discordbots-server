const { scheduleJob: ScheduleJob } = require('node-schedule');

const {
  resetRolls, resetClaimsPlebs,
  resetClaimsPatrons, refreshLeaderBoards,
  resetClaimsPatronsTwo, resetRollsPatronsTwo,
  clearStreaks, clearVoteStreaks,
  updateClaimsRollsPatronsWaiting,
  getNowDatabase,
} = require('../db/db');

new ScheduleJob('minute', '0 * * * * *', async () => {
  // refresh our materialized view
  // update leaderboard every minute,
  // it's like a 50ms query that rarely updates,
  // but there are also a lot of queries to handle.
  await refreshLeaderBoards().catch(console.error);
  console.log(await getNowDatabase());

  // update now
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // reset rolls for everyone
  if (minutes === 0) {
    await resetRolls();
    // clear streaks, more or less lenient every hour.
    await clearStreaks();
    await clearVoteStreaks();
    // reset the patron level 2 minutes if it was greater than 0.
    await updateClaimsRollsPatronsWaiting();
  }

  // third hour we reset claims for normal users.
  if (hours % 3 === 0 && minutes === 0) {
    await resetClaimsPlebs();
  }

  // second hour we reset claims for patrons.
  if (hours % 2 === 0 && minutes === 0) {
    await resetClaimsPatrons();
  }

  // check patron level 2
  await resetRollsPatronsTwo(minutes);
  await resetClaimsPatronsTwo(minutes);
});
