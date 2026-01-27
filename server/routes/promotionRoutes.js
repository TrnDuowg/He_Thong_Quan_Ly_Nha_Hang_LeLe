const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

router.get('/', promotionController.getAll);
router.post('/', promotionController.create);
router.delete('/:id', promotionController.delete);
router.post('/check', promotionController.checkVoucher);

module.exports = router;