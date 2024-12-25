const express = require('express');
const router = express.Router();
const semesterController = require('../../controllers/admin/semesterController');
const authMiddleware = require("../../middlewares/authMiddleware");
const isAdmin = require("../../middlewares/isAdmin");

// Rotas para os semestres
router.post('/semesters', authMiddleware, isAdmin, semesterController.registerSemester); // Registrar um novo semestre
router.put('/semesters/:id', authMiddleware, isAdmin, semesterController.updateSemester); // Atualizar um semestre existente
router.get('/semesters', authMiddleware, isAdmin, semesterController.getSemesters); // Listar todos os semestres ou buscar por ano
router.get('/semesters/:id', authMiddleware, isAdmin, semesterController.getSemesterById); // Buscar semestre por ID
router.delete('/semesters/:id', authMiddleware, isAdmin, semesterController.deleteSemester); // Deletar semestre por ID

module.exports = router;
