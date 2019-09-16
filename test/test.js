const rp = require('request-promise');
require('../src/app.js');

const assert = require('assert');
const { username, password, port } = require('../config.json');

describe('normal stat request', () => {
  it('should not have any error and 200 status code.', async () => {
    const result = await rp({
      url: `http://localhost:${port}/api/stats/`,
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
      resolveWithFullResponse: true,
    });
    assert(result.statusCode === 200);
  });
});
