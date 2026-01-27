const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST http://localhost:3000/api/orders
router.post('/', orderController.createOrder);

// [MỚI] API cho bếp
router.get('/kitchen', orderController.getKitchenOrders); // Lấy danh sách
router.put('/:id/status', orderController.updateOrderStatus); // Cập nhật trạng thái
router.get('/track/:code', orderController.getOrderByCode);
router.get('/history', orderController.getKitchenHistory);
router.get('/delivery', orderController.getDeliveryOrders);
// GET /api/orders/customer/:customerId
router.get('/customer/:customerId', orderController.getOrdersByCustomerId);
module.exports = router;