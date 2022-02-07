require('dotenv').config();
const axios = require('axios');
const { Duration } = require('luxon');

const wzStats = async (playerTag, mode) => {
    const modeName = {
        'all': 'Lifetime',
        'br': 'Battle Royale',
        'dmz' : 'Plunder',
        'rebirth': 'Resurgence'
    };

    try {
        const endpoint = mode == 'rebirth'
            ? 'warzone-matches'
            : 'warzone';

        const { data } = await axios.get(`https://call-of-duty-modern-warfare.p.rapidapi.com/${endpoint}/${playerTag}/battle`, {
            headers: {
                'x-rapidapi-host': 'call-of-duty-modern-warfare.p.rapidapi.com',
                'x-rapidapi-key': process.env.CODMWAPI_KEY
            }
        });

        if (!data) {
            console.error('Error: ', 'Invalid player data');
            return;
        }

        if (mode == 'rebirth') {
            const quad_stats = data.summary.br_rebirth_rbrthquad;
            const trio_stats = data.summary.br_rebirth_rbrthtrios;
            const duo_stats = data.summary.br_rebirth_rbrthduos;
            const solo_stats = data.summary.br_rebirth_rbrthsolos;

            const reqModeName = 'Resurgence';

            const kills = (quad_stats ? quad_stats.kills : 0)
                + (trio_stats ? trio_stats.kills : 0)
                + (duo_stats ? duo_stats.kills : 0)
                + (solo_stats ? solo_stats.kills : 0);

            const kdRatio = getKdRatio(quad_stats, trio_stats, duo_stats, solo_stats);

            const deaths = (quad_stats ? quad_stats.deaths : 0)
                + (trio_stats ? trio_stats.deaths : 0)
                + (duo_stats ? duo_stats.deaths : 0)
                + (solo_stats ? solo_stats.deaths : 0);

            const secondsPlayed = (quad_stats ? quad_stats.timePlayed : 0)
                + (trio_stats ? trio_stats.timePlayed : 0)
                + (duo_stats ? duo_stats.timePlayed : 0)
                + (solo_stats ? solo_stats.timePlayed : 0);

            const timePlayed = Duration.fromObject({ seconds: secondsPlayed }).toFormat('hh');

            return `| ${reqModeName} stats | Kills: ${kills} | Deaths: ${deaths} | K/D Ratio: ${kdRatio} | Time played:  ${timePlayed} hours |`;
        } else {
            let stats;

            switch(mode) {
                case 'br':
                    stats = data.br;
                    break;
                case 'dmz':
                    stats = data.br_dmz;
                    break;
                case 'all':
                default:
                    stats = data.br_all;
                    break;
            }

            const reqModeName = mode ? modeName[mode] : 'Lifetime';
            const wins = stats.wins;
            const kills = stats.kills;
            const kdRatio = Number(stats.kdRatio).toFixed(2);
            const deaths = stats.deaths;
            const timePlayed = Duration.fromObject({ seconds: stats.timePlayed }).toFormat('hh');

            return `| ${reqModeName} stats | Wins: ${wins} | Kills: ${kills} | Deaths: ${deaths} | K/D Ratio: ${kdRatio} | Time played:  ${timePlayed} hours |`;
        }
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

const getKdRatio = (quad_stats, trio_stats, duo_stats, solo_stats) => {

    const accumulatedKd = (quad_stats ? quad_stats.kdRatio * quad_stats.matchesPlayed : 0)
        + (trio_stats ? trio_stats.kdRatio * trio_stats.matchesPlayed : 0)
        + (duo_stats ? duo_stats.kdRatio * duo_stats.matchesPlayed : 0)
        + (solo_stats ? solo_stats.kdRatio * solo_stats.matchesPlayed : 0);

    const matchesPlayed = (quad_stats ? quad_stats.matchesPlayed : 0)
        + (trio_stats ? trio_stats.matchesPlayed : 0)
        + (duo_stats ? duo_stats.matchesPlayed : 0)
        + (solo_stats ? solo_stats.matchesPlayed : 0);

    return Number(accumulatedKd/matchesPlayed).toFixed(2);
}

module.exports = wzStats;