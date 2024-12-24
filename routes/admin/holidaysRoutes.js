const express = require('express');
const router = express.Router();
const holidayController = require('../../controllers/admin/holidayController');

router.post('/holidays', holidayController.registerHoliday);
router.put('/holidays/:id', holidayController.updateHoliday);
router.get('/holidays', holidayController.getHolidays);
router.get('/holidays/:id', holidayController.getHolidayById);
router.delete('/holidays/:id', holidayController.deleteHoliday);

module.exports = router;
