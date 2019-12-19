const axios = require('axios');
const {
  messenger: {
    hostM, portM,
    usernameM, passwordM,
  },
  bongo_bot_api: {
    host, port,
    username, password,
  },
} = require('../../config.json');

const messengerAPI = axios.create({
  baseURL: `http://${hostM}:${portM}`,
  auth: { usernameM, passwordM },
  headers: { 'Content-type': 'application/json' },
});

const bongoBotAPI = axios.create({
  baseURL: `http://${host}:${port}`,
  auth: { username, password },
  headers: { 'Content-type': 'application/json' },
});

module.exports = {
  messengerAPI,
  bongoBotAPI,
};
