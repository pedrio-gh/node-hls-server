const router = require('express').Router();
const homeRouter = require('./home');

router.use('/', homeRouter);

module.exports = router;
