const axios = require('axios');
const clearTMString = require('../../utils/clear-tm-string.js');
const { Duration } = require('luxon');

const totdInfo = async () => {
    try {
        const mapUid = await getMapUid();

        const { data } = await axios.get(`https://trackmania.io/api/map/${mapUid}`, {
            headers: { 'User-Agent': 'tm-stream-utils/0.1.0 +https://github.com/danilotitato/TM-stream-utils' }
        });

        const authorName = data.authorplayer.name;
        const mapName = clearTMString(data.name);
        const mapUrl = `https://trackmania.exchange/tracks/view/${data.exchangeid}`
        const mapUrlMessage = data.exchangeid ? `Check it here: ${mapUrl}` : 'Not uploaded to trackmania.exchange';
        const authorTime = Duration.fromMillis(data.authorScore).toFormat(data.authorScore >= 60000 ? 'mm:ss.SSS' : 'ss.SSS');

        return `${mapName} by ${authorName}. AT: ${authorTime}. ${mapUrlMessage}`;
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

module.exports = totdInfo;