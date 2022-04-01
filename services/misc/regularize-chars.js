const specialCharsMap = new Map([
    ['A', 'Á|À|Ã|Â|Ä|Å'],
    ['a', 'á|à|ã|â|ä|å'],
    ['AE', 'Æ|Ǣ|Ǽ|Æ̀|Æ̂|Æ̃'],
    ['ae', 'æ|ǣ|ǽ|æ̀|æ̂|æ̃'],
    ['E', 'É|È|Ê|Ë|Ě'],
    ['e', 'é|è|ê|ë|ě'],
    ['I', 'Í|Ì|Î|Ï'],
    ['i', 'í|ì|î|ï'],
    ['O', 'Ó|Ò|Ô|Õ|Ö|Ø'],
    ['o', 'ó|ò|ô|õ|ö|ø'],
    ['OE', 'Œ'],
    ['oe', 'œ'],
    ['U', 'Ú|Ù|Û|Ü|Ů'],
    ['u', 'ú|ù|û|ü|ů'],
    ['C', 'Ç|Č'],
    ['c', 'ç|č'],
    ['D', 'Þ|Ď'],
    ['d', 'þ|ď'],
    ['N', 'Ñ|Ň'],
    ['n', 'ñ|ň'],
    ['R', 'Ř'],
    ['r', 'ř'],
    ['S', 'Š'],
    ['s', 'š'],
    ['T', 'Ť'],
    ['t', 'ť'],
    ['Y', 'Ý'],
    ['y', 'ý'],
    ['Z', 'Ž'],
    ['z', 'ž']
]);

const reducer = (acc, [key]) => acc.replace(new RegExp(specialCharsMap.get(key), 'g'), key);

const regularizeChars = (text) => [...specialCharsMap].reduce(reducer, text);

module.exports = regularizeChars;