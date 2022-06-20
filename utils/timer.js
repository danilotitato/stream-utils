const timer = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = timer;