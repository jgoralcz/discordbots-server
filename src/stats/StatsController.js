const express = require('express');

const router = express.Router();
const statsHelper = require('./StatsHelper');

// post stats
router.route('/')
  .post(statsHelper.postStats);

module.exports = router;
