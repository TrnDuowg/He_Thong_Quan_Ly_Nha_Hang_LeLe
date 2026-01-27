const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Định nghĩa các route
router.get('/', productController.getMenu);
router.post('/', productController.createProduct); // Thêm
router.put('/:id', productController.updateProduct); // Sửa
router.delete('/:id', productController.deleteProduct); // Xóa
router.get('/:id', productController.getProductDetail);
// --- QUAN TRỌNG: PHẢI CÓ DÒNG NÀY Ở CUỐI CÙNG ---
module.exports = router;