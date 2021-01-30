const router = require('express').Router();
const footballController = require('../controllers/football.controller');

router.get('/', footballController.index);

module.exports = router;
