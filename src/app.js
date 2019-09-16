const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const log4js = require('log4js');

const routes = require('./routes/Routes');
const { username, password, port } = require('../config.json');
require('./dbl');
require('./cron/MinuteTask');

const logger = log4js.getLogger();
logger.level = 'info';

const app = express();

/**
 * async authorizer to test for credientials
 * @param user the user name.
 * @param pass the user's password.
 * @param cb the callback.
 * @returns {*}
 */
const myAsyncAuthorizer = (user, pass, cb) => {
  if (user === username && pass === password) {
    return cb(null, true);
  }
  return cb(null, false);
};

const getUnauthorizedResponse = req => (req.auth
  ? (`{ "error": "Credentials ${req.auth.user}:${req.auth.password} rejected" }`)
  : '{ "error": "No credentials provided" }');

app.use(basicAuth({
  authorizer: myAsyncAuthorizer,
  authorizeAsync: true,
  unauthorizedResponse: getUnauthorizedResponse,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(log4js.connectLogger(logger, {
  level: 'info',
  format: (req, res, format) => format(`:remote-addr - ${req.id} - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"`),
}));

app.use('/api', routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err.stack);
  return res.status(500).send({ error: 'An error has occurred. Please contact my creator.' });
});

app.listen(port, () => {
  logger.info(`Express server listening on port ${port}`);
});

module.exports = app;
