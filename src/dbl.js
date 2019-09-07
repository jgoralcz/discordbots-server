const dblapi = require('dblapi.js');
const rp = require('request-promise');
const db = require('./db/db');
const { dbl, streakAmount, maxStreak, updateServer, updatePort, username, password } = require('../config.json');

const home = `http://${updateServer}:${updatePort}/vote/`;
const discordBots = new dblapi(dbl.token, { webhookPort: dbl.port, webhookAuth: dbl.pass });

// webhook logic for posting votes.
discordBots.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

discordBots.webhook.on('vote', async vote => {
  let points = (vote.isWeekend) ? 4000 : 3000;

  try {
    // set up new member if needed
    const userInfo = await db.initializeGetUserInfo(vote.user);
    const streak = (userInfo.streak_vote || 0) + 1;

    // show the votes and points, account for streaks.
    points += (streak > 10) ? streakAmount * maxStreak : streakAmount * (streak - 1);

    // points info (streak included now)
    await db.updateUserBankPointsVote(vote.user, points);

    // only care if they voted a long time so we can record it.
    if(streak > 20) {
      // send to our server so that they can send it back to us.
      await rp({
        uri: home,
        method: 'POST',
        body: JSON.stringify({userID: vote.user, streak: streak, points: points}),
        auth: {
          'user': username,
          'pass': password
        },
        encoding: null,
        headers: {
          'Content-type': 'application/json'
        },
      });
    }
    else {
      console.log(`${vote.user} has received ${points} points, reset their rolls, and is on a ${streak} day voting streak.`);
    }
  }
  catch(error) {
    console.error(error);
  }
});

module.exports = discordBots;
