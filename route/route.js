const express = require('express');
const router = express.Router();
const retrievePlayerId = require('../utils/retrieve-player-id.js');
const cotdRemainingTime = require('../utils/cotd-remaining-time.js');
const lastCotdResult = require('../utils/last-cotd-result.js');
const isInputValidString = require('../utils/validate-input.js').isInputValidString;

router.get('/', (req, res) => {
    res.send('Yep, it is up');
});

router.get('/cotdtime', (req, res) => {
    res.send(cotdRemainingTime());
});

router.get('/lastcotd', async (req, res) => {
    const name = req.query.name;

    if (!isInputValidString(name)) {
        console.log(`lastcotd: Invalid player name ${name}`);
        res.status(400).send('Invalid player name');
        return;
    }

    try {
        const accountId = await retrievePlayerId(name);

        if (!accountId) {
            res.status(404).send('Player not found');
            return;
        }

        const result = await lastCotdResult(accountId);

        if (!result) {
            res.status(500).send('Malformed response from trackmania.io');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
