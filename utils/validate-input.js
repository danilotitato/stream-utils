const isInputValidString = input => {
    return input && (typeof input === 'string' || input instanceof String);
}

const isInputValidInteger = input => {
    let value;
    if (isNaN(input)) {
        return false;
    }
    value = parseFloat(input);
    return (value | 0) === value;
}

module.exports = {isInputValidString, isInputValidInteger};