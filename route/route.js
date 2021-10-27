const express = require('express');
const router = express.Router();
const cotdRemainingTime = require('../utils/cotdRemainingTime.js');

router.get('/cotdtime', (req, res) => {
    res.send(cotdRemainingTime());
});

module.exports = router;
