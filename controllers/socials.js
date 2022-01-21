const express = require('express');
const req = require('express/lib/request');
const socialsRouter = express.Router();

const instaWar = require('../services/socials/instagram.js').instaWar;
const lastInstaPost = require('../services/socials/instagram.js').lastInstaPost;
const lastTiktokPost = require('../services/socials/tiktok.js');

const isInputValidString = require('../utils/validate-input.js').isInputValidString;
const verifyTiktokCache = require('../utils/cache.js').verifyTiktokCache;

socialsRouter.get('/lastinsta', async (req, res) => {
    const user = req.query.user;

    if (!isInputValidString(user)) {
        res.status(400).send('Invalid username');
        return;
    }

    try {
        const result = await lastInstaPost(user);

        if (!result) {
            res.status(500).send('Malformed response from instagram');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

socialsRouter.get('/instawar', async (req, res) => {
    const targetUser = req.query.targetUser;
    const rivalUser = req.query.rivalUser;
    const targetAlias = req.query.targetAlias || targetUser;
    const rivalAlias = req.query.rivalAlias || rivalUser;
    const winningEmote = req.query.winningEmote || '';
    const losingEmote = req.query.losingEmote || '';

    if (!isInputValidString(targetUser) || !isInputValidString(rivalUser)
            || !isInputValidString(targetAlias) || !isInputValidString(rivalAlias)
            || !isInputValidString(winningEmote) || !isInputValidString(losingEmote)) {
        res.status(400).send('Invalid queries');
        return;
    }

    try {
        const result = await instaWar(targetUser, rivalUser, targetAlias, rivalAlias,
                winningEmote, losingEmote);

        if (!result) {
            res.status(500).send('Malformed response from instagram');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

socialsRouter.get('/lasttiktok', verifyTiktokCache, async (req, res) => {
    const user = req.query.user;

    if (!isInputValidString(user)) {
        res.status(400).send('Invalid username');
        return;
    }

    try {
        const result = await lastTiktokPost(user);

        if (!result) {
            res.status(500).send('Malformed response from tiktok');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = socialsRouter;
