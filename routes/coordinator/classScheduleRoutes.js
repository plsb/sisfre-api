const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const isCoordinator = require('../../middlewares/isCoordinator');
const classScheduleController = require('../../controllers/coordinator/classScheduleController');

// Rotas para gerenciamento de horários de aula
router.get('/class-schedules/:classId', authMiddleware, isCoordinator, classScheduleController.getClassSchedule);
router.post('/class-schedules', authMiddleware, isCoordinator, classScheduleController.registerClassSchedule);
router.delete('/class-schedules', authMiddleware, isCoordinator, classScheduleController.deleteClassSchedule);
//router.get('/class-schedules', authMiddleware, isCoordinator, classScheduleController.getClassSchedules);
//router.get('/class-schedules/:id', authMiddleware, isCoordinator, classScheduleController.getClassScheduleById);

module.exports = router;
