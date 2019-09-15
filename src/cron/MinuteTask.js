const { scheduleJob: ScheduleJob } = require('node-schedule');

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
  await refreshLeaderBoards().catch(console.error);

  // get our date times.
  const now = new Date();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  // reset rolls for everyone
  if (minutes === 0) {
    await resetRolls().catch(console.error);
    // clear streaks, more or less lenient every hour.
    await clearStreaks().catch(console.error);
    await clearVoteStreaks().catch(console.error);
    // reset the patron level 2 minutes
    await updateClaimsRollsPatronsWaiting().catch(console.error);
  }

  // third hour we reset claims for normal users.
  if (hours % 3 === 0 && minutes === 0) {
    await resetClaimsPlebs().catch(console.error);
  }

  // second hour we reset claims for patrons.
  if (hours % 2 === 0 && minutes === 0) {
    await resetClaimsPatrons().catch(console.error);
  }

  // reset all dailies for all users.
  if (hours / 12 === 1 && minutes === 0) {
    await resetAllClientDaily().catch(console.error);
  }

  // check patron level 2
  await resetRollsPatronsTwo(minutes).catch(console.error);
  await resetClaimsPatronsTwo(minutes).catch(console.error);
});
