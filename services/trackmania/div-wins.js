const axios = require('axios');

const divWins = async (accountId, firstDiv, cupNumber) => {
    try {
        let winCounter = 0,
            page = 0,
            pageSize = 0;
        do {
            const { data } = await axios.get(`https://trackmania.io/api/player/${accountId}/cotd/${page}`, {
                headers: { 'User-Agent': 'tm-stream-utils/0.1.0 +https://github.com/danilotitato/TM-stream-utils' }
            });

            pageSize = data.cotds.length;

            for (const cup of data.cotds) {
                const cupRunRe = /Cup of the Day \d{4}-\d{2}-\d{2} #(?<run>\d)/g;
                const cupRunResult = cupRunRe.exec(cup.name);
                const cupRun = cupNumber
                    ? cupRunResult
                        ? Number(cupRunResult.groups.run)
                        : 1 // Before reruns existed
                    : 0; // Force 0 if none is specified

                const isSelectedCup = cupRun === cupNumber;
                const isDivWin = isSelectedCup && Number(cup.divrank) === 1;
                const isDiv1Win = isSelectedCup && Number(cup.rank) === 1;
                const isWin = (isDivWin && !firstDiv) || isDiv1Win;

                if (isWin) ++winCounter;
            }

            ++page;
        } while (pageSize > 0);

        return `${winCounter} wins`;
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = divWins;