const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// GET /api/staff -> Lấy danh sách
router.get('/', staffController.getAllStaff);

// POST /api/staff -> Tạo mới
router.post('/', staffController.createStaff);

// DELETE /api/staff/:id -> Xóa
router.delete('/:id', staffController.deleteStaff);

module.exports = router;