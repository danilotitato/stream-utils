const axios = require('axios');

const modeIndex = {
    'overview': 0,
    'br': 1,
    'dmz': 2
};

const modeName = {
    'overview': 'Lifetime',
    'br': 'Battle Royale',
    'dmz': 'Plunder'
};

const wzStats = async (playerTag, mode) => {
    try {
        const { data } = await axios.get(`https://api.tracker.gg/api/v2/warzone/standard/profile/battlenet/${playerTag}`);

        if (!data.data.segments) {
            console.error('Error: ', 'Invalid player data');
            return;
        }

        if (!mode) { mode = 'overview'; }

        const reqModeIndex = modeIndex[mode];
        const reqModeName = modeName[mode];

        const wins = data.data.segments[reqModeIndex].stats.wins.value;
        const kills = data.data.segments[reqModeIndex].stats.kills.value;
        const deaths = data.data.segments[reqModeIndex].stats.deaths.value;
        const kdRatio = data.data.segments[reqModeIndex].stats.kdRatio.value;
        const timePlayed = data.data.segments[reqModeIndex].stats.timePlayed.displayValue;

        return `| ${reqModeName} stats | Wins: ${wins} | Kills: ${kills} | Deaths: ${deaths} | K/D Ratio: ${kdRatio} | Time played: ${timePlayed} |`;
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = wzStats;