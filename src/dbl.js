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
  console.log(`User with ID ${vote.user} voted:`, new Date());
  let points = 3000;

  // is weekend, 4000 points
  if(vote != null && vote.isWeekend) {
    points = 4000;
  }

  // give the users an extra 36 hours.
  let now = new Date();
  now.setHours(now.getHours() + 36);
  now = now.toLocaleString();

  try {
    // set up new member if needed
    const userInfo = await db.initializeGetUserInfo(vote.user);
    const streak = (userInfo.streak_vote || 0) + 1;

    // show the votes and points
    (streak > 10) ? points += streakAmount * maxStreak : points += streakAmount * (streak - 1);

    // points info (streak included now)
    await db.updateUserBankPointsVote(vote.user, points, new Date(), now);

    // only care if they voted a long time so we can record it.
    if(streak > 20) {
      // send to our server so that they can send it back to us.
      const request = await rp({
        uri: home,
        method: 'POST',
        body: {'userID': vote.user, 'streak': streak},
        auth: {
          'user': username,
          'pass': password
        }
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
