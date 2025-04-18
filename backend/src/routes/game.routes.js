const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const { checkUser } = require('../middlewares/auth.middleware');

router.post('/score', checkUser, gameController.updateScore);
router.post('/levelup', checkUser, gameController.levelUp);
router.post('/upgrade-gun', checkUser, gameController.upgradeGun);

module.exports = router;
