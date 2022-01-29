const clearTMString = input => {
    const re = /\$([0-9A-Fa-f]{1,3}|[wnoitsgzWNOITSGZ]{1})/g;
    return input.replaceAll(re, '');
}

module.exports = clearTMString;