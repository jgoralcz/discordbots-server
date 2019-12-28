const axios = require('axios');
const {
  messenger: {
    api: apiM,
    username: usernameM, password: passwordM,
  },
  bongo_bot_api: {
    api,
    username, password,
  },
} = require('../../config.json');

const messengerAPI = axios.create({
  baseURL: apiM,
  auth: { username: usernameM, password: passwordM },
  headers: { 'Content-type': 'application/json' },
});

const bongoBotAPI = axios.create({
  baseURL: api,
  auth: { username, password },
  headers: { 'Content-type': 'application/json' },
});

module.exports = {
  messengerAPI,
  bongoBotAPI,
};
