const express = require('express');
const router = express.Router();
const allUsersController = require('../../controllers/all-users/allUsersController');
const authMiddleware = require("../../middlewares/authMiddleware");


// Rotas para os semestres
router.get('/all/semesters', authMiddleware, allUsersController.getSemestersActive); // Registrar um novo semestre

module.exports = router;
