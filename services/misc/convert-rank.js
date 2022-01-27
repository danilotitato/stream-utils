const getNumberWithOrdinal = require('../../utils/ordinal-suffix.js');

const convertRank = rank => {
    const rankRe = /(?<rank>\d+)\/\d+/g;

    const rankValue = rankRe.exec(rank);

    if (!rankValue) {
        console.error('Error: ', 'Invalid rank');
        return;
    }

    return getNumberWithOrdinal(rankValue.groups.rank);
}

module.exports = convertRank;