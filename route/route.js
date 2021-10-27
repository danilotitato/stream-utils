const express = require('express');
const router = express.Router();
const cotdRemainingTime = require('../utils/cotd-remaining-time.js');

router.get('/', (req, res) => {
    res.send('Yep, it is up');
});

router.get('/cotdtime', (req, res) => {
    res.send(cotdRemainingTime());
});

module.exports = router;
