const express = require('express');
const req = require('express/lib/request');
const ytRouter = express.Router();

const randomVideo = require('../services/youtube/random-video.js')

const isInputValidString = require('../utils/validate-input.js').isInputValidString;

ytRouter.get('/randomytvideo', async (req, res) => {
    const channel = req.query.channel;

    if (!isInputValidString(channel)) {
        res.status(400).send('Invalid channel name');
        return;
    }

    try {
        const result = await randomVideo(channel);

        if (!result) {
            res.status(500).send('Malformed response from youtube');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = ytRouter;
