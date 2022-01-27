const express = require('express');
const req = require('express/lib/request');
const miscRouter = express.Router();

const convertRank = require('../services/misc/convert-rank.js');

const isInputValidString = require('../utils/validate-input.js').isInputValidString;

miscRouter.get('/convertrank', async (req, res) => {
    const rank = req.query.rank;

    if (!isInputValidString(rank)) {
        res.status(400).send('Invalid input');
        return;
    }
    
    try {
        const result = convertRank(rank);

        if (!result) {
            res.status(500).send('Invalid rank');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = miscRouter;
