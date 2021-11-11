const axios = require('axios');
const { DateTime } = require('luxon');

const cotdRanking = async (accountId, isPrimaryOnly, isAvgOnly) => {
    try {
        const { data } = await axios.get(`https://trackmania.io/api/player/${accountId}/cotd/0`, {
            headers: { 'User-Agent': 'tm-stream-utils/0.1.0 +https://github.com/danilotitato/TM-stream-utils' }
        });

        const avgRank = (data.stats.avgrank * 100).toFixed(2);
        const avgDiv = Math.round(data.stats.avgdiv);

        if (avgRank == 0 || avgDiv == 0) {
            console.error('Error: ', 'Invalid COTD data');
            return;
        }

        const bestOverallRank = isPrimaryOnly ? data.stats.bestprimary.bestrank : data.stats.bestoverall.bestrank;
        const bestOverallRankTime = DateTime
            .fromISO(isPrimaryOnly ? data.stats.bestprimary.bestranktime : data.stats.bestoverall.bestranktime)
            .toLocaleString({ month: 'long', day: 'numeric', year: 'numeric' });

        const bestDiv = isPrimaryOnly ? data.stats.bestprimary.bestdiv : data.stats.bestoverall.bestdiv;
        const bestRankDivRank = isPrimaryOnly ? data.stats.bestprimary.bestrankdivrank : data.stats.bestoverall.bestrankdivrank;
        const bestDivTime = DateTime
            .fromISO(isPrimaryOnly ? data.stats.bestprimary.bestdivtime : data.stats.bestoverall.bestdivtime)
            .toLocaleString({ month: 'long', day: 'numeric', year: 'numeric' });

        const bestRankInDiv = isPrimaryOnly ? data.stats.bestprimary.bestrankindiv : data.stats.bestoverall.bestrankindiv;
        const bestRankInDivDiv = isPrimaryOnly ? data.stats.bestprimary.bestrankindivdiv : data.stats.bestoverall.bestrankindivdiv;
        const bestRankInDivTime = DateTime
            .fromISO(isPrimaryOnly ? data.stats.bestprimary.bestrankindivtime : data.stats.bestoverall.bestrankindivtime)
            .toLocaleString({ month: 'long', day: 'numeric', year: 'numeric' });

        return isAvgOnly
            ? `top ${avgRank}%, being in division ${avgDiv} in average.`
            : `best overall rank has been ${bestOverallRank} on ${bestOverallRankTime}. ` +
                `The best division has been ${bestDiv}, finished in rank ${bestRankDivRank}, on ${bestDivTime}. ` +
                `And the best rank in a cup has been ${bestRankInDiv} in division ${bestRankInDivDiv} on ${bestRankInDivTime}`;
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = cotdRanking;