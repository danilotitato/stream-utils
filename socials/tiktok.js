require('dotenv').config();
const axios = require('axios');
const getCache = require('../utils/cache.js').getCache;
const getBackupCache = require('../utils/cache.js').getBackupCache;

const timer = ms => new Promise(resolve => setTimeout(resolve, ms));

const maxAttepmts = 5;

const lastTiktokPost = async username => {
    let attempts = 1;
    
    try {
        const apiKey = process.env.SCRAPERAPI_KEY;
        const videoUrlRe = /www.tiktok.com\/@\w+\/video\/\d+/gm;

        let lastVideos;
        while(true) {
            const tiktokUrl = `www.tiktok.com/@${username}`;
            const scraperUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${tiktokUrl}`;
            const page = await axios.get(scraperUrl);

            lastVideos = page.data.match(videoUrlRe);

            const cache = getCache();
            const backupCache = getBackupCache();

            if (lastVideos) {
                cache.set(username, lastVideos[0]);
                backupCache.set(username, lastVideos[0]);
                return lastVideos[0];
            }

            if (attempts >= maxAttepmts && backupCache.has(username)) {
                return backupCache.get(username);
            }

            ++attempts;
            await timer(500);
        }
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = lastTiktokPost;
