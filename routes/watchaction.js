const express = require('express');
const req = require('express/lib/request');
const waRouter = express.Router();

const getRandom = require('../watchactions/get-random.js');

waRouter.get('/random', async (req, res) => {
    try {
        const result = await getRandom();

        if (!result) {
            res.status(500).send('Malformed response from api');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = waRouter;
