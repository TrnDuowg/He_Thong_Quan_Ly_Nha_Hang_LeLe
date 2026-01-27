const express = require('express');
const router = express.Router();
const posController = require('../controllers/posController');

router.get('/dashboard', posController.getPosStats);

module.exports = router;