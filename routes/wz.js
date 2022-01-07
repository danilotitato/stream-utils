const express = require('express');
const req = require('express/lib/request');
const wzRouter = express.Router();

const wzStats = require('../warzone/wz-stats.js');

const isInputValidString = require('../utils/validate-input.js').isInputValidString;

wzRouter.get('/stats', async (req, res) => {
    const playerTag = req.query.playerTag;
    const mode = req.query.mode;

    if (!isInputValidString(playerTag) || (mode && !isInputValidString(mode))) {
        res.status(400).send('Invalid player tag or mode');
        return;
    }

    try {
        const result = await wzStats(playerTag.replace('#', '%23'), mode);

        if (!result) {
            res.status(500).send('Malformed response from tracker api');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = wzRouter;
