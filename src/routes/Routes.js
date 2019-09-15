const router = require('express-promise-router');

const statsHelper = require('./StatsHelper');

// list of routes
router.use('/stats', statsHelper);

module.exports = router;
