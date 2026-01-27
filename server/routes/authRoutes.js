const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Khi ai đó gọi POST vào đường dẫn /login thì chạy hàm login bên controller
router.post('/login', authController.login);

module.exports = router;
