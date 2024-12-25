const {Sequelize} = require("sequelize");
const Semester = require("../../models/admin/Semester");

exports.getSemestersActive = async (req, res) => {

    try {

        // Realiza a consulta com base nos filtros
        const semesters = await Semester.findAll({
            where: {status : 1},
            order: [
                ['year', 'DESC'],
                ['semester', 'DESC'],
                ['status', 'DESC'],
            ],
        });

        res.json({ semesters });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar semestres.' });
    }
};