const { DateTime } = require('luxon');

const countup = (isoDate, format) => {
    const startDate = DateTime.fromISO(isoDate).toUTC();
    const currentTime = DateTime.now();

    return currentTime.diff(startDate).toFormat(format);
}

module.exports = countup;