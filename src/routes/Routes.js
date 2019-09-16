const router = require('express-promise-router')();
const stats = require('./Stats');

// list of routes
router.use('/stats', stats);

module.exports = router;
