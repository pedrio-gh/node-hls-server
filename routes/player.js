const router = require('express').Router();
const playerController = require('../controllers/player.controller');

router.get('/', playerController.index);

module.exports = router;
