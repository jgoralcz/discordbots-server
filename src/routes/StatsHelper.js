const discordBots = require('../dbl');

/**
 * post stats to dbl
 * @param req the request object with our values.
 * @param res the response object with our values.
 * @returns {Promise<void>}
 */
const postStats = async (req, res) => {
  const { servers, shardID, shardCount } = req.body;
  await discordBots.postStats(servers, shardID, shardCount);
  res.sendStatus(200);
};


module.exports = {
  postStats,
};
