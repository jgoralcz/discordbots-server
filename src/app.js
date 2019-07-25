const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const statsController = require('./stats/StatsController');
const { username, password } = require('../config.json');
require('./dbl');

/**
 * app configuration for express.
 * We need to use json and make sure we have the right credentials.
 * @type {Function|*}
 */
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

app.use('/stats', statsController);

module.exports = app;
