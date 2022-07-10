const express = require('express');
const req = require('express/lib/request');
const tmRouter = express.Router();

const campaignLeaderboard = require('../services/trackmania/campaign-leaderboard.js');
const cotdRanking = require('../services/trackmania/cotd-ranking.js');
const cotdRemainingTime = require('../services/trackmania/cotd-remaining-time.js');
const lastCotdResult = require('../services/trackmania/last-cotd-result.js');
const rankMatchMaking = require('../services/trackmania/rank-matchmaking.js');
const retrieveCampaignId = require('../services/trackmania/retrieve-campaign-id.js');
const retrievePlayerId = require('../services/trackmania/retrieve-player-id.js');
const timePlaying = require('../services/trackmania/time-playing.js');
const totdInfo = require('../services/trackmania/totd-info.js');
const divWins = require('../services/trackmania/div-wins.js');

const isInputValidString = require('../utils/validate-input.js').isInputValidString;
const isInputValidInteger = require('../utils/validate-input.js').isInputValidInteger;
const isInputValidBoolean = require('../utils/validate-input.js').isInputValidBoolean;

tmRouter.get('/cotdtime', (req, res) => {
    try {
        res.send(cotdRemainingTime());
    } catch (error) {
        res.status(400).send(error.message);
    }
});

tmRouter.get('/lastcotd', async (req, res) => {
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

tmRouter.get('/3v3rank', async (req, res) => {
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

tmRouter.get('/royalrank', async (req, res) => {
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

tmRouter.get('/totdinfo', async (req, res) => {
    try {
        res.send(await totdInfo());
    } catch (error) {
        res.status(400).send(error.message);
    }
});

tmRouter.get('/timeplaying', async (req, res) => {
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

tmRouter.get('/bestcotd', async (req, res) => {
    const name = req.query.name;
    const isPrimary = req.query.isPrimary || 'false';

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

tmRouter.get('/avgcotd', async (req, res) => {
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

tmRouter.get('/leaderboard', async (req, res) => {
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

tmRouter.get('/divwins', async (req, res) => {
    const name = req.query.name;
    const firstDiv = req.query.firstDiv || 'false';
    const cupNumber = req.query.cupNumber || 0;

    if (!isInputValidString(name)) {
        res.status(400).send('Invalid player name');
        return;
    }

    if (!isInputValidBoolean(firstDiv) || !isInputValidInteger(cupNumber)
        || ![0, 1, 2, 3].includes(Number(cupNumber))) {
        res.status(400).send('Invalid COTD wins requisition');
        return;
    }

    try {
        const accountId = await retrievePlayerId(name);

        if (!accountId) {
            res.status(404).send('Player not found');
            return;
        }

        const result = await divWins(accountId, (firstDiv === 'true'), Number(cupNumber));

        if (!result) {
            res.status(500).send('Malformed response from trackmania.io');
            return;
        }

        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = tmRouter;
