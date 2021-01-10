const router = require('express').Router();
const homeRouter = require('./home');
const playerRouter = require('./player');

router.use('/', homeRouter);
router.use('/player', playerRouter);

module.exports = router;
