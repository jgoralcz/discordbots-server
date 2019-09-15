const rp = require('request-promise');

require('../src/server.js');
const { username, password, port } = require('../config.json');

setTimeout(async () => {
  const result = await rp({
    uri: `http://localhost:${port}/api/stats/`,
    method: 'POST',
    body: JSON.stringify({ servers: 42500, shardID: 0, shardCount: 22 }),
    auth: {
      user: username,
      pass: password,
    },
    encoding: null,
    headers: {
      'Content-type': 'application/json',
    },
  });

  console.log(result);
}, 5000);
