const { DateTime } = require('luxon');

const cotdRemainingTime = () => {
    const now = DateTime.now().toUTC();

    const cotDayTime = now.set({hour: 17, minute: 0});
    const cotNightTime = now.set({hour: 1, minute: 0});
    const cotMorningTime = now.set({hour: 9, minute: 0});

    const diffDay = getTimeDiff(now, cotDayTime);
    const diffNight = getTimeDiff(now, cotNightTime);
    const diffMorning = getTimeDiff(now, cotMorningTime);

    const hours = Math.min(diffDay.hours, diffNight.hours, diffMorning.hours);
    const minutes = diffDay.minutes; // they will always be the same
    const nextCup = hours === diffDay.hours
        ? 'Day'
        : hours === diffNight.hours
            ? 'Night'
            : 'Morning';
    const runningCup = getRunningCup(nextCup, hours, minutes);

    return (runningCup ? `Cup of the ${runningCup} may still be running. ` : '')
        + (hours === 0 ? '' : `${hours}h and `)
        + `${minutes} min until the next Cup of the ${nextCup}`;
}

const getRunningCup = (nextCup, hours, minutes) => {
    if (hours >= 7 && minutes >= 15) { // rough estimative of 45 minutes per cup
        return nextCup === 'Day'
            ? 'Morning'
            : nextCup === 'Morning'
                ? 'Night'
                : 'Day';
    }
}

const getTimeDiff = (now, cupTime) => {
    let diff = cupTime.diff(now, ['hours', 'minutes']).toObject();

    if (diff.hours < 0 || diff.minutes < 0)
        diff = cupTime.plus({days: 1}).diff(now, ['hours', 'minutes']).toObject();

    return diff;
}

module.exports = cotdRemainingTime;