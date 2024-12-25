const Course = require("../../models/admin/Course");
const {Sequelize} = require("sequelize");
const User = require("../../models/admin/User");

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