const router = require('express').Router();
const playerController = require('../controllers/player');

router.get('/', playerController.play);

module.exports = router;
