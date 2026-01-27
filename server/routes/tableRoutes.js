const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.get('/', tableController.getTables);
router.post('/', tableController.createTable);      // Thêm
router.put('/:id', tableController.updateTable);    // Sửa thông tin
router.put('/:id/status', tableController.updateTableStatus); // Sửa trạng thái (POS dùng)
router.delete('/:id', tableController.deleteTable); // Xóa

module.exports = router;