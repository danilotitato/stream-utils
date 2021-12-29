require('dotenv').config();
const axios = require('axios');
const getCache = require('../utils/cache.js').getCache;

const timer = ms => new Promise(resolve => setTimeout(resolve, ms))

const lastTiktokPost = async username => {
    try {
        const videoUrlRe = /www.tiktok.com\/@\w+\/video\/\d+/gm;

        let lastVideos;
        while(true) {
            const tiktokUrl = `www.tiktok.com/@${username}`;
            const scraperUrl = `http://api.scraperapi.com?api_key=${process.env.SCRAPERAPI_KEY}&url=${tiktokUrl}`;
            const page = await axios.get(scraperUrl);

            lastVideos = page.data.match(videoUrlRe);

            if (lastVideos) {
                const cache = getCache();
                cache.set(username, lastVideos[0]);
                return lastVideos[0];
            }

            await timer(500);
        }
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = lastTiktokPost;
