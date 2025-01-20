const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const isCoordinator = require('../../middlewares/isCoordinator');
const coordinatesController = require('../../controllers/coordinator/coordinatesController');

router.get('/coordinator/professors', authMiddleware, isCoordinator, coordinatesController.getProfessors);
router.get('/coordinator/subjects', authMiddleware, isCoordinator, coordinatesController.getSubjects);

module.exports = router;