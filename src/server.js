const app = require('./app');
const { port } = require('../config.json');

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Express server listening on port ${port}`);
});
