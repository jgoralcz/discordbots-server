const { scheduleJob: ScheduleJob } = require('node-schedule');

const {
  resetRolls, resetClaimsPlebs,
  resetClaimsPatrons, refreshLeaderBoards,
  resetClaimsPatronsTwo, resetRollsPatronsTwo,
  clearStreaks, clearVoteStreaks,
  updateClaimsRollsPatronsWaiting,
} = require('../db/db');

new ScheduleJob('minute', '0 * * * * *', async () => {
  // refresh our materialized view
  // update leaderboard every minute,
  // it's like a 50ms query that rarely updates,
  // but there are also a lot of queries to handle.
  await refreshLeaderBoards().catch(console.error);

  // get our date times.
  const now = new Date();
  now.setHours(-3); // we want a similar time frame to America/Montreal
  const minutes = now.getMinutes();
  const hours = now.getHours();

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


// help from
// https://stackoverflow.com/questions/15141762/how-to-initialize-a-javascript-date-to-a-particular-time-zone
const changeTimezone = (date, ianatz) => {

  // suppose the date is 12:00 UTC
  const invdate = new Date(date.toLocaleString('en-US', {
    timeZone: ianatz
  }));

  // then invdate will be 07:00 in Toronto
  // and the diff is 5 hours
  const diff = date.getTime()-invdate.getTime();

  // so 12:00 in Toronto is 17:00 UTC
  return new Date(date.getTime()+diff);
};
