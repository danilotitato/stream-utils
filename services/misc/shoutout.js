const timer = require('../../utils/timer.js');
const NOT_LIVE = '<not live>';

const shoutout = async (amount, min, delay, uptime, shoutoutMsg) => {
    await timer(delay);

    return amount < min || uptime === NOT_LIVE ? '' : shoutoutMsg;
}

module.exports = shoutout;