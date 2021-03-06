const axios = require('axios');
const getNumberWithOrdinal = require('../../utils/ordinal-suffix.js');

const matchMakingType = {
    '3v3': 0,
    'Royal': 1,
};

const rankName3v3 = {
    '1': 'Bronze I',
    '2': 'Bronze II',
    '3': 'Bronze III',
    '4': 'Silver I',
    '5': 'Silver II',
    '6': 'Silver III',
    '7': 'Gold I',
    '8': 'Gold II',
    '9': 'Gold III',
    '10': 'Master I',
    '11': 'Master II',
    '12': 'Master III',
    '13': 'Trackmaster',
};

const rankNameRoyal = {
    '1': 'Unranked',
    '2': 'Bronze',
    '3': 'Silver',
    '4': 'Gold',
    '5': 'Master',
};

const rankNames = [rankName3v3, rankNameRoyal];

const rankMatchMaking = async (accountId, type) => {

    try {
        const { data } = await axios.get(`https://trackmania.io/api/player/${accountId}`, {
            headers: { 'User-Agent': 'tm-stream-utils/0.1.0 +https://github.com/danilotitato/TM-stream-utils' }
        });

        const matchmakingData = data.matchmaking[matchMakingType[type]];

        if (!matchmakingData) {
            console.error('Error: ', 'Invalid matchmaking data');
            return;
        }

        const position = matchmakingData.info.division.position;
        const rank = getNumberWithOrdinal(matchmakingData.info.rank);
        const score = matchmakingData.info.score;
        const remainingScore = matchmakingData.info.division_next.minpoints - score;
        const nextRank = matchmakingData.info.division_next.position;

        const rankName = rankNames[matchMakingType[type]][position];
        const nextRankName = rankNames[matchMakingType[type]][nextRank];


        return `| TM ${type} | Rank: ${rankName}` + (type == '3v3' ? ` | ${score} points (${remainingScore} left for ${nextRankName})` : '') + ` | ${rank} in the world |`;
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = rankMatchMaking;