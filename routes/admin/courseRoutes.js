const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const isAdmin = require('../../middlewares/isAdmin');
const courseController = require('../../controllers/admin/courseController');

// Rotas para gerenciamento de cursos
router.post('/courses', authMiddleware, isAdmin, courseController.registerCourse);
router.put('/courses/:id', authMiddleware, isAdmin, courseController.updateCourse);
router.get('/courses', authMiddleware, isAdmin, courseController.getCourses);
router.get('/courses/:id', authMiddleware, isAdmin, courseController.getCourseById);
router.delete('/courses/:id', authMiddleware, isAdmin, courseController.deleteCourse);

module.exports = router;
