const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET http://localhost:3000/api/dashboard
router.get('/', dashboardController.getDashboardStats);

module.exports = router;
