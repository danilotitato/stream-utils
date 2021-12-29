require('dotenv').config();
const axios = require('axios');

const timer = ms => new Promise(resolve => setTimeout(resolve, ms))

const lastTiktokPost = async username => {
    try {
        const videoUrlRe = /www.tiktok.com\/@\w+\/video\/\d+/gm;

        let lastVideos;
        while(true) {
            const tiktokUrl = `www.tiktok.com/@${username}`;
            const scraperUrl = `http://api.scraperapi.com?api_key=${process.env.SCRAPERAPI_KEY}&url=${tiktokUrl}`;
            const page = await axios.get(scraperUrl, { cache: {maxAge: 60 * 60 * 1000 } });

            lastVideos = page.data.match(videoUrlRe);

            if (lastVideos) {
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
