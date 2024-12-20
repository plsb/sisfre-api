const express = require('express');
const router = express.Router();
const subjectController = require('../../controllers/admin/subjectController');

// Rotas para as disciplinas
router.post('/subjects', subjectController.registerSubject); // Registrar uma nova disciplina
router.put('/subjects/:id', subjectController.updateSubject); // Atualizar uma disciplina existente
router.get('/subjects', subjectController.getSubjects); // Listar todas as disciplinas
router.get('/subjects/:id', subjectController.getSubjectById); // Buscar disciplina por ID
router.delete('/subjects/:id', subjectController.deleteSubject); // Deletar disciplina por ID

module.exports = router;
