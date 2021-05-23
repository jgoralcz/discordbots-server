const router = require('express-promise-router')();
const stats = require('./stats');
const webhook = require('./webhook');

router.use('/stats', stats);
router.use('/webhook', webhook);

module.exports = router;
