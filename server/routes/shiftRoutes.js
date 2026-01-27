const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

router.get('/', shiftController.getAllShifts);
router.get('/:id', shiftController.getShiftDetail);
router.post('/open', shiftController.openShift); 
router.post('/close', shiftController.closeShift);
module.exports = router;