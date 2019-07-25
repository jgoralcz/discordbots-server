const index = require('../src/server.js');
const rp = require('request-promise');
const { username, password, port} = require('../config.json');

setTimeout(async () => {
  await rp({
    uri: `http://localhost:${port}/stats/`,
    method: 'POST',
    body: JSON.stringify({servers: '9001', shardID: 50, shardCount: 400}),
    auth: {
      'user': username,
      'pass': password
    },
    encoding: null,
    headers: {
      'Content-type': 'application/json'
    },
  });

}, 5000);


