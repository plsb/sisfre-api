const express = require('express');
const router = express.Router();
const semesterController = require('../../controllers/admin/semesterController');

// Rotas para os semestres
router.post('/semesters', semesterController.registerSemester); // Registrar um novo semestre
router.put('/semesters/:id', semesterController.updateSemester); // Atualizar um semestre existente
router.get('/semesters', semesterController.getSemesters); // Listar todos os semestres ou buscar por ano
router.get('/semesters/:id', semesterController.getSemesterById); // Buscar semestre por ID
router.delete('/semesters/:id', semesterController.deleteSemester); // Deletar semestre por ID

module.exports = router;
