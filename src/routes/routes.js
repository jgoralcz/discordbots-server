const router = require('express-promise-router')();
const stats = require('./stats');

router.use('/stats', stats);

module.exports = router;
