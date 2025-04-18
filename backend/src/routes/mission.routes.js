const express = require('express');
const router = express.Router();
const missionController = require('../controllers/mission.controller');
const { checkUser } = require('../middlewares/auth.middleware');

router.post('/complete', checkUser, missionController.completeMission);

module.exports = router;
