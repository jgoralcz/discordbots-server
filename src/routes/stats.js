const app = require('express-promise-router')();
const discordBots = require('../dbl');

app.post('/', async (req, res) => {
  const { body } = req;
  if (!body) return res.status(400).send({ error: 'No body provided.' });

  const { servers, shardID, shardCount } = body;
  if (servers == null || shardID == null || shardCount == null) {
    return res.status(400).send({ error: `Invalid data received. Need [servers, shardID, shardCount], received: ${body}` });
  }

  await discordBots.postStats(servers, shardID, shardCount);
  return res.status(200).send({ servers, shardID, shardCount });
});

module.exports = app;
