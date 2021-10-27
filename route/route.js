const express = require('express');
const router = express.Router();
const cotdRemainingTime = require('../utils/cotd-remaining-time.js');
const isInputValidString = require('../utils/validate-input.js').isInputValidString;

router.get('/', (req, res) => {
    res.send('Yep, it is up');
});

router.get('/cotdtime', (req, res) => {
    res.send(cotdRemainingTime());
});

router.get('/lastcotd', (req, res) => {
    const accountId = req.query.query;

    if (!isInputValidString(accountId)) {
        console.log("lastcotd: Invalid account id");
        res.status(400).send("Invalid account id");
        return;
    }
});

module.exports = router;
