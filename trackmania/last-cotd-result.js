const axios = require('axios');
const { DateTime } = require('luxon');
const getNumberWithOrdinal = require('../utils/ordinal-suffix.js');

const lastCotdResult = async accountId => {
    const cupNumberName = {
        '1': 'Cup of the Day',
        '2': 'Cup of the Night',
        '3': 'Cup of the Morning',
    }

    try {
        const { data } = await axios.get(`https://trackmania.io/api/player/${accountId}/cotd/0`, {
            headers: { 'User-Agent': 'tm-stream-utils/0.1.0 +https://github.com/danilotitato/TM-stream-utils' }
        });

        const lastCotdData = data.cotds[0];

        const fullName = lastCotdData.name;
        const cupNumber = fullName.split('#')[1];

        const cupName = cupNumberName[cupNumber]

        if (!cupName) {
            console.error('Error: ', 'Invalid cup number');
            return;
        }

        const cupDate = DateTime.fromISO(lastCotdData.timestamp).toLocaleString({ month: 'long', day: 'numeric', year: 'numeric' });

        const percentageRank = ((lastCotdData.rank / lastCotdData.totalplayers) * 100).toFixed(2);

        const overallRank = getNumberWithOrdinal(lastCotdData.rank);
        const divRank = getNumberWithOrdinal(lastCotdData.divrank);

        return `| ${cupName} of ${cupDate} | Div: ${lastCotdData.div} | Rank: ${divRank} | Overall rank: ${overallRank} (Top ${percentageRank}%) |`;
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = lastCotdResult;