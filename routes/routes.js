const express = require('express');
const req = require('express/lib/request');
const router = express.Router();

router.get('/', (req, res) => {
    const empty = req.query.empty;
    if (empty) {
        res.end();
        return;
    }
    res.send('YEP it is up');
});

router.use('/tm', require('./tm.js'));
router.use('/wz', require('./wz.js'));
router.use('/socials', require('./socials.js'));

module.exports = router;
