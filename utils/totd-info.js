const axios = require('axios');

const totdInfo = async () => {
    try {
        const mapUid = await getMapUid();

        const { data } = await axios.get(`https://trackmania.io/api/map/${mapUid}`, {
            headers: { 'User-Agent': 'tm-stream-utils/0.1.0 +https://github.com/danilotitato/TM-stream-utils' }
        });

        const authorName = data.authorplayer.name;
        const mapName = cleanTMString(data.name);
        const mapUrl = `https://trackmania.exchange/tracks/view/${data.exchangeid}`

        return `${mapName} by ${authorName}. Check it here: ${mapUrl}`;
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

const getMapUid = async () => {
    const { data } = await axios.get('https://trackmania.io/api/totd/today', {
        headers: { 'User-Agent': 'tm-stream-utils/0.1.0 +https://github.com/danilotitato/TM-stream-utils' }
    });

    return data.uid;
}

const cleanTMString = input => {
    const re = /\$([0-9A-Fa-f]{1,3}|[wnoitsgz]{1})/g;
    return input.replaceAll(re, '');
}

module.exports = totdInfo;