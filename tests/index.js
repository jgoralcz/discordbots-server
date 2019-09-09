const index = require('../src/server.js');
const rp = require('request-promise');
const { username, password, port} = require('../config.json');

setTimeout(async () => {
  const result = await rp({
    uri: `http://localhost:${port}/stats/`,
    method: 'POST',
    body: JSON.stringify({servers: 40500, shardID: 0, shardCount: 22}),
    auth: {
      user: username,
      pass: password
    },
    encoding: null,
    headers: {
      'Content-type': 'application/json'
    },
  });

  console.log(result);
}, 5000);


