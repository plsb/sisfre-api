const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const isAdmin = require('../../middlewares/isAdmin');
const courseController = require('../../controllers/admin/courseController'); // Verifique o caminho correto

// Rotas para gerenciamento de cursos
router.post('/courses', authMiddleware, isAdmin, courseController.registerCourse); // Cadastrar um novo curso
router.put('/courses/:id', authMiddleware, isAdmin, courseController.updateCourse); // Atualizar um curso existente
router.get('/courses', authMiddleware, isAdmin, courseController.getCourses); // Listar cursos
router.get('/courses/:id', authMiddleware, isAdmin, courseController.getCourseById); // Obter um curso por ID

module.exports = router;
