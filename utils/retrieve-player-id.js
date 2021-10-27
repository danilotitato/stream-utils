const axios = require('axios');

const retrievePlayerId = async playerName => {
    try {
        const { data } = await axios.get(`https://trackmania.io/api/players/find?search=${playerName}`, {
            headers: { 'User-Agent': 'tm-stream-utils/0.1.0 +https://github.com/danilotitato/TM-stream-utils' }
        });

        if (data.length && playerName.toUpperCase() === data[0].player.name.toUpperCase()) {
            return data[0].player.id;
        }

        console.error('Error: ', 'Player not found');
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = retrievePlayerId;
