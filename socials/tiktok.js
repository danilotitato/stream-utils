const axios = require('axios');

const lastTiktokPost = async username => {
    try {
        const videoUrlRe = /https:\/\/www.tiktok.com\/@\w+\/video\/\d+/gm;

        const page = await axios.get(`www.tiktok.com/@${username}`, {cache: {maxAge: 60 * 60 * 1000}}, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36' }});

        return page.data.match(videoUrlRe)[0];
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = lastTiktokPost;
