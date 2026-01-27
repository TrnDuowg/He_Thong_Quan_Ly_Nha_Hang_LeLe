const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');

// GET /api/revenue?startDate=2023-01-01&endDate=2023-01-31
router.get('/', revenueController.getRevenueReport);
// GET /api/revenue/daily/2026-01-26
router.get('/daily/:date', revenueController.getDetailsByDate);
// GET /api/revenue/payment-stats
router.get('/payment-stats', revenueController.getPaymentStats);
module.exports = router;