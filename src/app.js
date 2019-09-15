const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const log4js = require('log4js');

const routes = require('./routes/Routes');
const { username, password } = require('../config.json');
require('./dbl');
require('./cron/MinuteTask');

const logger = log4js.getLogger();
logger.level = 'error';

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

/**
 * no credentials.
 * @param req the user's request.
 * @returns {string}
 */
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

app.use('/api', routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send({ error: 'An error has occurred. Please contact my creator.' });
});

module.exports = app;
