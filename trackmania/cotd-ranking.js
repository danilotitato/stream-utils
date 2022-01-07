const axios = require('axios');

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

        const bestDiv = isPrimaryOnly ? data.stats.bestprimary.bestdiv : data.stats.bestoverall.bestdiv;
        const bestRankDivRank = isPrimaryOnly ? data.stats.bestprimary.bestrankdivrank : data.stats.bestoverall.bestrankdivrank;

        const bestRankInDiv = isPrimaryOnly ? data.stats.bestprimary.bestrankindiv : data.stats.bestoverall.bestrankindiv;
        const bestRankInDivDiv = isPrimaryOnly ? data.stats.bestprimary.bestrankindivdiv : data.stats.bestoverall.bestrankindivdiv;

        const rerunString = isPrimaryOnly ? '' : ' (including reruns)';

        return isAvgOnly
            ? `| COTD Average | Top ${avgRank}% | Division ${avgDiv} |`
            : `| COTD Best ${rerunString} | Rank: ${bestOverallRank} ` +
                `| Div: ${bestDiv} (Rank ${bestRankDivRank}) ` +
                `| Top Rank in div: ${bestRankInDiv} (Div ${bestRankInDivDiv}) |`;
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = cotdRanking;