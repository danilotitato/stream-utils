const express = require('express');
const req = require('express/lib/request');
const miscRouter = express.Router();

const convertRank = require('../services/misc/convert-rank.js');
const regularizeChars = require('../services/misc/regularize-chars.js');
const removeString = require('../services/misc/remove-string.js');

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

miscRouter.get('/regularchars', async (req, res) => {
    const str = req.query.str;

    if (!isInputValidString(str)) {
        res.status(400).send('Invalid input');
        return;
    }

    try {
        const result = regularizeChars(str);

        if (!result) {
            res.status(500).send('Error converting');
            return;
        }

        res.send(encodeURIComponent(result));
    } catch (error) {
        res.status(400).send(error.message);
    }
});

miscRouter.get('/removestring', async (req, res) => {
    const str = req.query.str;
    const remove = req.query.remove;

    if (!isInputValidString(str) || !isInputValidString(remove)) {
        res.status(400).send('Invalid input');
        return;
    }

    try {
        const result = removeString(str, remove);

        if (!result) {
            res.status(500).send('Error removing string');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = miscRouter;
