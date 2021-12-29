const NodeCache = require('node-cache');

let cache = null;

const getCache = () => {
    if (!cache) {
        cache = new NodeCache({ stdTTL: 60 * 60 });
    }
    return cache;
}

const verifyTiktokCache = (req, res, next) => {
    try {
        const tiktokCache = getCache();
        const user = req.query.user;

        if (tiktokCache.has(user)) {
            res.send(tiktokCache.get(user));
            return;
        }

        return next();
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = {getCache, verifyTiktokCache};
