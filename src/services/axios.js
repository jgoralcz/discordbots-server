const axios = require('axios');
const { api, config } = require('../util/constants/paths');

const {
  messenger_api: {
    username: usernameM,
    password: passwordM,
  },
  bongo_bot_api: {
    username: usernameB,
    password: passwordB,
  },
} = require(api);

const {
  messenger_api: messengerURL,
  bongo_bot_api: bongoBotURL,
} = require(config);

const messengerAPI = axios.create({
  baseURL: messengerURL,
  auth: { username: usernameM, password: passwordM },
  headers: { 'Content-type': 'application/json' },
});

const bongoBotAPI = axios.create({
  baseURL: bongoBotURL,
  auth: { username: usernameB, password: passwordB },
  headers: { 'Content-type': 'application/json' },
});

module.exports = {
  messengerAPI,
  bongoBotAPI,
};
