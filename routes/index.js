const router = require('express').Router();
const homeRouter = require('./home');
const footballRouter = require('./football');
const playerRouter = require('./player');

router.use('/', homeRouter);
router.use('/football', footballRouter);
router.use('/player', playerRouter);

module.exports = router;
