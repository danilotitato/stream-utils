const getNumberWithOrdinal = number => {
    const ordinal = ["th", "st", "nd", "rd"], value = number % 100;
    return number + (ordinal[(value - 20) % 10] || ordinal[value] || ordinal[0]);
}

module.exports = getNumberWithOrdinal;