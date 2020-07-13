const bodyparser = require('body-parser');
const express = require('express');
const logger = require('log4js').getLogger();

const router = require('./routes/routes');

const { basicAuth, authorizer, unauthResponse } = require('./middleware/basicAuth');
const { errorHandler } = require('./middleware/errorhandler');
const { httpLogger } = require('./middleware/logger');

const { LOCAL } = require('./util/constants/environments');

require('./dbl');
require('./cron/MinuteTask');

logger.level = 'info';
const port = 8443;

const env = process.env.NODE_ENV || LOCAL;

const server = express();

server.use(basicAuth({
  authorizer,
  authorizeAsync: true,
  unauthorizedResponse: unauthResponse,
}));

server.use(bodyparser.urlencoded({ extended: true }));
server.use(bodyparser.json());
server.use(httpLogger());

server.use('/', router, errorHandler);

server.listen(port, () => logger.info(`${env.toUpperCase()} server started on ${port}.`));
