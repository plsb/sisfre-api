const User = require('../models/admin/User');
const Course = require('../models/admin/Course');

// Middleware para verificar se o usuário é um coordenador de algum curso
module.exports = async (req, res, next) => {
    const { userId } = req; // O id do usuário foi armazenado no req.userId

    try {
        // Recupera todos os cursos onde o usuário é o coordenador
        const courses = await Course.findAll({ where: { coordinatorId: userId } });

        if (courses.length === 0) {
            return res.status(403).json({ error: 'Somente coordenadores de cursos podem realizar esta ação' });
        }

        // Adiciona os cursos encontrados ao objeto req para que a rota possa acessar
        req.courses = courses;

        next(); // Chama a próxima função (permitindo o acesso à rota)
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao verificar permissões do coordenador' });
    }
};
