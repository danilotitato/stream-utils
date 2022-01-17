const { DateTime } = require('luxon');

const cotdRemainingTime = () => {
    const localTime = DateTime.now().setZone('Europe/Paris');

    // Cup times specified by Nadeo
    const cotDayTime = localTime.set({hour: 19, minute: 0});
    const cotNightTime = localTime.set({hour: 3, minute: 0});
    const cotMorningTime = localTime.set({hour: 11, minute: 0});

    const diffDay = getTimeDiff(localTime, cotDayTime);
    const diffNight = getTimeDiff(localTime, cotNightTime);
    const diffMorning = getTimeDiff(localTime, cotMorningTime);

    const hours = Math.min(diffDay.hours, diffNight.hours, diffMorning.hours);
    const minutes = diffDay.minutes; // They will always be the same
    const nextCup = hours === diffDay.hours
        ? 'Day'
        : hours === diffNight.hours
            ? 'Night'
            : 'Morning';
    const runningCup = getRunningCup(nextCup, hours, minutes);
    const phase = minutes >= 45 ? 'Qualification' : 'Knockout'; // First 15 minutes for seeding

    return (runningCup ? `Cup of the ${runningCup} may still be running (${phase} phase). ` : '')
        + (hours === 0 ? '' : `${hours}h and `)
        + `${minutes} min until the next Cup of the ${nextCup}`;
}

const getRunningCup = (nextCup, hours, minutes) => {
    if (hours >= 7 && minutes >= 10) { // Rough estimative of 50 minutes per cup
        return nextCup === 'Day'
            ? 'Morning'
            : nextCup === 'Morning'
                ? 'Night'
                : 'Day';
    }
}

const getTimeDiff = (localTime, cupTime) => {
    let diff = cupTime.diff(localTime, ['hours', 'minutes']).toObject();

    if (diff.hours < 0 || diff.minutes < 0)
        diff = cupTime.plus({days: 1}).diff(localTime, ['hours', 'minutes']).toObject();

    return diff;
}

module.exports = cotdRemainingTime;