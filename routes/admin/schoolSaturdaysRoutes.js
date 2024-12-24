const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const isAdmin = require('../../middlewares/isAdmin');
const schoolSaturdayController = require('../../controllers/admin/schoolSaturdayController');

// Rotas para gerenciamento de sábados escolares
router.post('/school-saturdays', authMiddleware, isAdmin, schoolSaturdayController.registerSchoolSaturday);
router.put('/school-saturdays/:id', authMiddleware, isAdmin, schoolSaturdayController.updateSchoolSaturday);
router.get('/school-saturdays', authMiddleware, isAdmin, schoolSaturdayController.getSchoolSaturdays);
router.get('/school-saturdays/:id', authMiddleware, isAdmin, schoolSaturdayController.getSchoolSaturdayById);
router.delete('/school-saturdays/:id', authMiddleware, isAdmin, schoolSaturdayController.deleteSchoolSaturday);

module.exports = router;
