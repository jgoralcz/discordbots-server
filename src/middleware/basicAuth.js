const basicAuth = require('express-basic-auth');
const { basicAuth: auth } = require('../util/constants/paths');

const { username, password } = require(auth);

const authorizer = (user, pass, cb) => {
  if (user === username && pass === password) {
    return cb(null, true);
  }
  return cb(null, false);
};

const unauthResponse = req => (req.auth
  ? JSON.stringify({ error: `Credentials ${req.auth.user}:${req.auth.password} rejected` })
  : JSON.stringify({ error: 'No credentials provided' })
);

module.exports = {
  basicAuth,
  authorizer,
  unauthResponse,
};
