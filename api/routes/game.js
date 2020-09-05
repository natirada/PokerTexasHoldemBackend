const express = require('express');

const router = express.Router();

const GameController = require('../controllers/game');

router.post('/play', GameController.play);

module.exports = router;
