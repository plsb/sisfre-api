const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const isCoordinator = require('../../middlewares/isCoordinator');
const classController = require('../../controllers/coordinator/classController');
const coursesCoordinatesController = require('../../controllers/coordinator/coursesCoordinatesController');

router.get('/classes/courses-coordinates', authMiddleware, isCoordinator, coursesCoordinatesController.getCoursesCoordinates);
// Rotas para gerenciamento de aulas
router.post('/classes', authMiddleware, isCoordinator, classController.registerClass);
router.put('/classes/:id', authMiddleware, isCoordinator, classController.updateClass);
router.get('/classes', authMiddleware, isCoordinator, classController.getClasses);
router.get('/classes/:id', authMiddleware, isCoordinator, classController.getClassById);
router.delete('/classes/:id', authMiddleware, isCoordinator, classController.deleteClass);

module.exports = router;
