const axios = require('axios');
const { DateTime } = require('luxon');

const timePlaying = async (accountId) => {
    try {
        const { data } = await axios.get(`https://trackmania.io/api/player/${accountId}`, {
            headers: { 'User-Agent': 'tm-stream-utils/0.1.0 +https://github.com/danilotitato/TM-stream-utils' }
        });

        if (!data.timestamp) {
            console.error('Error: ', 'Invalid player data');
            return;
        }

        const startDate = DateTime.fromISO(data.timestamp).setZone('Europe/Paris');
        const currentTime = DateTime.now().setZone('Europe/Paris');
        const totalTime = currentTime.diff(startDate, ['years', 'months', 'days', 'hours']).toObject();
        const startDateString = startDate.toLocaleString({ month: 'long', day: 'numeric', year: 'numeric' });

        const yearsString = totalTime.years ? ` ${totalTime.years} year${totalTime.years > 1 ? 's' : ''},` : '';
        const monthsString = totalTime.months ? ` ${totalTime.months} month${totalTime.months > 1 ? 's' : ''} and ` : '';
        const daysString = `${totalTime.days} day${totalTime.days > 1 ? 's' : ''}`;

        return `${startDateString}. It has been${yearsString}${monthsString}${daysString} since`;
    } catch (error) {
        console.error('Error: ', error.message);
        throw error;
    }
}

module.exports = timePlaying;