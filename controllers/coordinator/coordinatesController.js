const Course = require("../../models/admin/Course");
const {Sequelize} = require("sequelize");
const User = require("../../models/admin/User");
const Subject = require("../../models/admin/Subject");

/*
    Controller para retornar Models necessários para o Coordenador
 */

exports.getCoursesCoordinates = async (req, res) => {
    const { userId } = req;

    try {
        let courses;
            courses = await Course.findAll({
                include: [
                    {
                        model: User,
                        as: 'coordinator',
                        attributes: ['id', 'username', 'email'],
                        where: { id: userId }
                    },
                ],
                order: [['name', 'ASC']], // Ordena os resultados por nome em ordem crescente
            });

        res.json({ courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar cursos' });
    }
};

exports.getProfessors = async (req, res) => {

    try {
        const where = {
            accessType: { [Sequelize.Op.notIn]: ['admin', 'staff'] },
        };

        const users = await User.findAll({
            where,
            order: [['username', 'ASC']],
        });

        res.json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
};

exports.getSubjects = async (req, res) => {
    try {
        let subjects = await Subject.findAll({
            order: [['name', 'ASC']],
        });

        res.json({ subjects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar disciplinas.' });
    }
};