const axios = require('axios');

const campaignLeaderboard = async (campaign, campaignId, clubId) => {
    try {
        const leaderboardUid = await getLeaderboardUid(campaignId, clubId);

        const { data } = await axios.get(`https://trackmania.io/api/leaderboard/${leaderboardUid}`, {
            headers: { 'User-Agent': 'tm-stream-utils/0.1.0 +https://github.com/danilotitato/TM-stream-utils' }
        });

        const formatter = new Intl.NumberFormat('en', { notation: 'compact' });

        const firstPlace = data.tops.length > 0
            ? `| :first_place: ${data.tops[0].player.name} (${formatter.format(data.tops[0].points)} points) |`
            : 'No players on the leaderboard';

        const secondPlace = data.tops.length > 1
            ? ` :second_place: ${data.tops[1].player.name} (${formatter.format(data.tops[1].points)} points) |`
            : '';

        const thirdPlace = data.tops.length > 2
            ? ` :third_place: ${data.tops[2].player.name} (${formatter.format(data.tops[2].points)} points) |`
            : '';

        return `${campaign} leaderboard: ${firstPlace}${secondPlace}${thirdPlace}`;
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

const getLeaderboardUid = async (campaignId, clubId) => {
    const { data } = await axios.get(`https://trackmania.io/api/campaign/${clubId}/${campaignId}`, {
        headers: { 'User-Agent': 'tm-stream-utils/0.1.0 +https://github.com/danilotitato/TM-stream-utils' }
    });

    return data.leaderboarduid;
}

module.exports = campaignLeaderboard;