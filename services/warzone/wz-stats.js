const axios = require('axios');

const modeIndex = {
    'overview': 0,
    'br': 1,
    'dmz': 2,
    'rebirth': 3
};

const modeName = {
    'overview': 'Lifetime',
    'br': 'Battle Royale',
    'dmz': 'Plunder',
    'rebirth': 'Resurgence'
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
        const kdRatio = data.data.segments[reqModeIndex].stats.kdRatio.value;
        const deaths = data.data.segments[reqModeIndex].stats.deaths
            ? data.data.segments[reqModeIndex].stats.deaths.value
            : Math.round(kills/kdRatio); // Calculate the deaths number by the K/D ratio
        const timePlayed = data.data.segments[reqModeIndex].stats.timePlayed
            ? ` Time played: ${data.data.segments[reqModeIndex].stats.timePlayed.displayValue} |`
            : ''; // Don't show time played while not available for Rebirth

        return `| ${reqModeName} stats | Wins: ${wins} | Kills: ${kills} | Deaths: ${deaths} | K/D Ratio: ${kdRatio} |${timePlayed}`;
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = wzStats;