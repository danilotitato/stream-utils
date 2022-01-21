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

router.use('/tm', require('../controllers/tm.js'));
router.use('/wz', require('../controllers/wz.js'));
router.use('/socials', require('../controllers/socials.js'));
router.use('/watchaction', require('../controllers/watchaction.js'));

module.exports = router;
