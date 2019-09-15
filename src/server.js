const log4js = require('log4js');

const app = require('./app');
const { port } = require('../config.json');

const logger = log4js.getLogger();
logger.level = 'info';


app.listen(port, () => {
  logger.info(`Express server listening on port ${port}`);
});
