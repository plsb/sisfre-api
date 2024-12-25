const { Sequelize } = require('sequelize');
const Class = require('../../models/coordinator/Class');
const Course = require('../../models/admin/Course');
const Semester = require('../../models/admin/Semester');
const ClassSchedule = require('../../models/coordinator/ClassSchedule');
const User= require('../../models/admin/User');
const Subject = require('../../models/admin/Subject');

exports.registerClass = async (req, res) => {
    const { courseId, description, semesterId } = req.body;
    const { userId } = req; // Assuming `req.user.id` contains the ID of the logged-in user

    if (!courseId || !description || !semesterId) {
        return res.status(400).json({ error: 'Os campos (curso, descrição, semestre) são obrigatórios' });
    }

    try {
        // Verificar se o curso existe
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Curso não encontrado' });
        }

        // Verificar se o usuário é o coordenador do curso
        if (course.coordinatorId !== userId) {
            return res.status(403).json({ error: 'Você não tem permissão para adicionar turmas a este curso' });
        }

        // Verificar se o semestre existe e se está ativo
        const semester = await Semester.findByPk(semesterId);
        if (!semester) {
            return res.status(404).json({ error: 'Semestre não encontrado' });
        }
        if (!semester.status) {
            return res.status(400).json({ error: 'Semestre não está ativo' });
        }

        // Criar a turma
        const newClass = await Class.create({ courseId, description, semesterId });
        res.status(201).json({ class: newClass });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar turma' });
    }
};

exports.updateClass = async (req, res) => {
    const { courseId, description, semesterId } = req.body;
    const classId = req.params.id;
    const { userId } = req;  // Obtém o id do usuário logado a partir do token JWT

    if (!courseId && !description && !semesterId) {
        return res.status(400).json({ error: 'Pelo menos um campo (curso, descrição, semestre) deve ser fornecido para atualização' });
    }

    try {
        // Verificar se a turma existe
        const classToUpdate = await Class.findByPk(classId);
        if (!classToUpdate) {
            return res.status(404).json({ error: 'Turma não encontrada' });
        }

        // Verificar se o curso existe e se o usuário logado é o coordenador
        if (courseId) {
            const course = await Course.findByPk(courseId);
            if (!course) {
                return res.status(404).json({ error: 'Curso não encontrado' });
            }

            // Verificar se o usuário logado é o coordenador do curso
            if (course.coordinatorId !== userId) {
                return res.status(403).json({ error: 'Somente o coordenador do curso pode fazer essa alteração' });
            }

            classToUpdate.courseId = courseId;
        }

        // Atualizar a descrição se fornecida
        if (description) {
            classToUpdate.description = description;
        }

        // Verificar se o semestre existe e se está ativo
        if (semesterId) {
            const semester = await Semester.findByPk(semesterId);
            if (!semester) {
                return res.status(404).json({ error: 'Semestre não encontrado' });
            }

            // Verificar se o semestre está ativo (status é true)
            if (!semester.status) {
                return res.status(400).json({ error: 'O semestre deve estar ativo para ser associado à turma' });
            }

            classToUpdate.semesterId = semesterId;
        }

        // Salvar as alterações
        await classToUpdate.save();
        res.status(200).json({ message: 'Turma atualizada com sucesso', class: classToUpdate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar turma' });
    }
};

// Listar turmas
exports.getClasses = async (req, res) => {
    const { courseId, semesterId } = req.query;

    try {
        let classes;

        if (courseId || semesterId) {
            // Busca turmas com base no curso e/ou semestre
            classes = await Class.findAll({
                where: {
                    ...(courseId && { courseId }),
                    ...(semesterId && { semesterId }),
                },
                include: [
                    {
                        model: Course,
                        as: 'course',
                        attributes: ['id', 'name', 'acronym', 'coordinatorId'],
                        where: { coordinatorId: req.userId },
                    },
                    {
                        model: Semester,
                        as: 'semester',
                        attributes: ['id', 'year', 'semester', 'type', 'start_date', 'end_date'],
                        where: { status: 1 },
                    },
                    {
                        model: ClassSchedule,
                        as: 'classSchedules', // Assumes 'classSchedules' as the alias in the association
                        include: [
                            {
                                model: User,
                                as: 'professor',
                                attributes: ['id', 'username', 'email', 'accessType'], // Example attributes of User (professor)
                            },
                            {
                                model: Subject,
                                as: 'subject',
                                attributes: ['id', 'name'],
                            },
                        ],
                    },
                ],
                order: [['id', 'ASC']], // Ordena os resultados por ID em ordem crescente
            });
        } else {
            // Retorna todas as turmas
            classes = await Class.findAll({
                include: [
                    {
                        model: Course,
                        as: 'course',
                        attributes: ['id', 'name', 'acronym', 'coordinatorId'],
                        where: { coordinatorId: req.userId },
                    },
                    {
                        model: Semester,
                        as: 'semester',
                        attributes: ['id', 'year', 'semester', 'type', 'start_date', 'end_date'],
                        where: { status: 1 },
                    },
                    {
                        model: ClassSchedule,
                        as: 'classSchedules',
                        include: [
                            {
                                model: User,
                                as: 'professor',
                                attributes: ['id', 'username', 'email', 'accessType'],
                            },
                            {
                                model: Subject,
                                as: 'subject',
                                attributes: ['id', 'name'],
                            },
                        ],
                    },
                ],
                order: [['id', 'ASC']], // Ordena os resultados por ID em ordem crescente
            });
        }

        res.json({ classes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar turmas' });
    }
};


// Buscar turma por ID
exports.getClassById = async (req, res) => {
    const classId = req.params.id;

    try {
        const classFound = await Class.findByPk(classId, {
            include: [
                {
                    model: Course,
                    as: 'course',
                    attributes: ['id', 'name', 'acronym'],
                    where: { coordinatorId: req.userId },
                },
                {
                    model: Semester,
                    as: 'semester',
                    attributes: ['id', 'year', 'semester', 'type', 'start_date', 'end_date'],
                    where: { status: 1 },
                },
            ],
        });

        if (!classFound) {
            return res.status(404).json({ error: 'Turma não encontrada' });
        }

        res.json({ class: classFound });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar turma' });
    }
};

// Deletar turma
exports.deleteClass = async (req, res) => {
    const classId = req.params.id;
    const { userId } = req;

    try {
        // Procura a turma pelo ID
        const classToDelete = await Class.findByPk(classId);

        if (!classToDelete) {
            // Retorna erro 404 se a turma não for encontrada
            return res.status(404).json({ error: 'Turma não encontrada.' });
        }

        const course = await Course.findByPk(classToDelete.courseId);

        // Verificar se o usuário logado é o coordenador do curso
        if (course && course.coordinatorId !== userId) {
            return res.status(403).json({ error: 'Somente o coordenador do curso pode fazer essa alteração' });
        }

        // Exclui a turma
        await classToDelete.destroy();
        res.status(200).json({ message: 'Turma deletada com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar a turma.' });
    }
};
