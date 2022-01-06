const express = require('express');
const req = require('express/lib/request');
const router = express.Router();

const campaignLeaderboard = require('../trackmania/campaign-leaderboard.js');
const cotdRanking = require('../trackmania/cotd-ranking.js');
const cotdRemainingTime = require('../trackmania/cotd-remaining-time.js');
const lastCotdResult = require('../trackmania/last-cotd-result.js');
const rankMatchMaking = require('../trackmania/rank-matchmaking.js');
const retrieveCampaignId = require('../trackmania/retrieve-campaign-id.js');
const retrievePlayerId = require('../trackmania/retrieve-player-id.js');
const timePlaying = require('../trackmania/time-playing.js');
const totdInfo = require('../trackmania/totd-info.js');

const instaWar = require('../socials/instagram.js').instaWar;
const lastInstaPost = require('../socials/instagram.js').lastInstaPost;
const lastTiktokPost = require('../socials/tiktok.js');

const isInputValidString = require('../utils/validate-input.js').isInputValidString;
const isInputValidBoolean = require('../utils/validate-input.js').isInputValidBoolean;
const verifyTiktokCache = require('../utils/cache.js').verifyTiktokCache;

router.get('/', (req, res) => {
    const empty = req.query.empty;
    if (empty) {
        res.end();
        return;
    }
    res.send('YEP it is up');
});

router.get('/cotdtime', (req, res) => {
    try {
        res.send(cotdRemainingTime());
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/lastcotd', async (req, res) => {
    const name = req.query.name;

    if (!isInputValidString(name)) {
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

router.get('/3v3rank', async (req, res) => {
    const name = req.query.name;

    if (!isInputValidString(name)) {
        res.status(400).send('Invalid player name');
        return;
    }

    try {
        const accountId = await retrievePlayerId(name);

        if (!accountId) {
            res.status(404).send('Player not found');
            return;
        }

        const result = await rankMatchMaking(accountId, '3v3');

        if (!result) {
            res.status(404).send('Matchmaking info not available');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/royalrank', async (req, res) => {
    const name = req.query.name;

    if (!isInputValidString(name)) {
        res.status(400).send('Invalid player name');
        return;
    }

    try {
        const accountId = await retrievePlayerId(name);

        if (!accountId) {
            res.status(404).send('Player not found');
            return;
        }

        const result = await rankMatchMaking(accountId, 'Royal');

        if (!result) {
            res.status(404).send('Matchmaking info not available');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/totdinfo', async (req, res) => {
    try {
        res.send(await totdInfo());
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/timeplaying', async (req, res) => {
    const name = req.query.name;

    if (!isInputValidString(name)) {
        res.status(400).send('Invalid player name');
        return;
    }

    try {
        const accountId = await retrievePlayerId(name);

        if (!accountId) {
            res.status(404).send('Player not found');
            return;
        }

        const result = await timePlaying(accountId);

        if (!result) {
            res.status(500).send('Malformed response from trackmania.io');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/bestcotd', async (req, res) => {
    const name = req.query.name;
    const isPrimary = req.query.isPrimary;

    if (!isInputValidString(name)) {
        res.status(400).send('Invalid player name');
        return;
    }

    if (!isInputValidBoolean(isPrimary)) {
        res.status(400).send('Invalid type of rank requisition');
        return;
    }

    try {
        const accountId = await retrievePlayerId(name);

        if (!accountId) {
            res.status(404).send('Player not found');
            return;
        }

        const result = await cotdRanking(accountId, (isPrimary === 'true') , false);

        if (!result) {
            res.status(500).send('Malformed response from trackmania.io');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/avgcotd', async (req, res) => {
    const name = req.query.name;

    if (!isInputValidString(name)) {
        res.status(400).send('Invalid player name');
        return;
    }

    try {
        const accountId = await retrievePlayerId(name);

        if (!accountId) {
            res.status(404).send('Player not found');
            return;
        }

        const result = await cotdRanking(accountId, false , true);

        if (!result) {
            res.status(500).send('Malformed response from trackmania.io');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/leaderboard', async (req, res) => {
    const campaign = req.query.campaign;

    if (!isInputValidString(campaign)) {
        res.status(400).send('Invalid campaign');
        return;
    }

    try {
        const [campaignId, clubId] = await retrieveCampaignId(campaign);

        if (!campaignId || !clubId) {
            res.status(404).send('Campaign or club not found');
            return;
        }

        const result = await campaignLeaderboard(campaign, campaignId, clubId);

        if (!result) {
            res.status(500).send('Malformed response from trackmania.io');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/lastinsta', async (req, res) => {
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

router.get('/instawar', async (req, res) => {
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

router.get('/lasttiktok', verifyTiktokCache, async (req, res) => {
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

module.exports = router;
