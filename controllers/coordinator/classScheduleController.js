const ClassSchedule = require('../../models/coordinator/ClassSchedule');
const Class = require('../../models/coordinator/Class');
const Subject = require('../../models/admin/Subject');
const User = require('../../models/admin/User');

exports.registerClassSchedule = async (req, res) => {
    const { classId, subjectId, shift, schedule, professorId, dayWeek } = req.body;

    // Verificar se todos os campos obrigatórios foram fornecidos
    if (!classId || !subjectId || !shift || !schedule || !professorId || !dayWeek) {
        return res.status(400).json({ error: 'Todos os campos (classId, subjectId, shift, schedule, professorId, dayWeek) são obrigatórios' });
    }

    // Validar valores para os campos ENUM
    if (!['M', 'T', 'N'].includes(shift)) {
        return res.status(400).json({ error: 'O turno (shift) deve ser "M" (Manhã), "T" (Tarde) ou "N" (Noite)' });
    }

    if (!['AB', 'CD'].includes(schedule)) {
        return res.status(400).json({ error: 'O horário (schedule) deve ser "AB" ou "CD"' });
    }

    if (!['segunda', 'terca', 'quarta', 'quinta', 'sexta'].includes(dayWeek)) {
        return res.status(400).json({ error: 'O dia da semana (dayWeek) deve ser "segunda", "terca", "quarta", "quinta" ou "sexta"' });
    }

    try {
        // Validar se a classe existe
        const classInstance = await Class.findByPk(classId);
        if (!classInstance) {
            return res.status(404).json({ error: 'Classe não encontrada' });
        }

        // Validar se a disciplina existe
        const subjectInstance = await Subject.findByPk(subjectId);
        if (!subjectInstance) {
            return res.status(404).json({ error: 'Disciplina não encontrada' });
        }

        // Validar se o professor existe
        const professor = await User.findByPk(professorId);
        if (!professor) {
            return res.status(404).json({ error: 'Professor não encontrado' });
        }

        // Verificar se já existe um horário para a mesma classe, dia, turno e horário
        const existingSchedule = await ClassSchedule.findOne({
            where: { classId, dayWeek, shift, schedule },
        });

        if (existingSchedule) {
            return res.status(400).json({ error: 'Já existe um horário cadastrado para essa classe, dia, turno e horário' });
        }

        // Criar o horário da aula
        const classSchedule = await ClassSchedule.create({
            classId,
            subjectId,
            shift,
            schedule,
            professorId,
            dayWeek,
        });

        res.status(201).json({ classSchedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar o horário da aula' });
    }
};

exports.getClassSchedule = async (req, res) => {
    const { classId } = req.params;

    try {
        // Verifica se o classId foi fornecido
        if (!classId) {
            return res.status(400).json({ error: 'classId é obrigatório' });
        }

        // Busca o horário da classe
        const classSchedules = await ClassSchedule.findAll({
            where: { classId },
            include: [
                {
                    model: Subject,
                    as: 'subject',
                    attributes: ['id', 'name', 'acronym'], // Inclui a disciplina associada
                },
                {
                    model: User,
                    as: 'professor',
                    attributes: ['id', 'username', 'email'], // Inclui o professor associado
                },
            ],
            order: [['dayWeek', 'ASC'], ['shift', 'ASC'], ['schedule', 'ASC']], // Ordena por dia, turno e horário
        });


        if (!classSchedules.length) {
            return res.status(404).json({ error: 'Nenhum horário encontrado para esta turma.' });
        }

        res.json({ classSchedules });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar horários da turma' });
    }
};

exports.deleteClassSchedule = async (req, res) => {
    const { classId, shift, schedule, dayWeek } = req.body;

    // Verificar se todos os campos obrigatórios foram fornecidos
    if (!classId || !shift || !schedule || !dayWeek) {
        return res.status(400).json({ error: 'Todos os campos (classId, shift, schedule, dayWeek) são obrigatórios' });
    }

    // Validar valores para os campos ENUM
    if (!['M', 'T', 'N'].includes(shift)) {
        return res.status(400).json({ error: 'O turno (shift) deve ser "M" (Manhã), "T" (Tarde) ou "N" (Noite)' });
    }

    if (!['AB', 'CD'].includes(schedule)) {
        return res.status(400).json({ error: 'O horário (schedule) deve ser "AB" ou "CD"' });
    }

    if (!['segunda', 'terca', 'quarta', 'quinta', 'sexta'].includes(dayWeek)) {
        return res.status(400).json({ error: 'O dia da semana (dayWeek) deve ser "segunda", "terca", "quarta", "quinta" ou "sexta"' });
    }

    try {
        // Verificar se o horário existe
        const classSchedule = await ClassSchedule.findOne({
            where: { classId, shift, schedule, dayWeek },
        });

        if (!classSchedule) {
            return res.status(404).json({ error: 'Horário da aula não encontrado' });
        }

        // Deletar o horário da aula
        await classSchedule.destroy();

        res.status(200).json({ message: 'Horário da aula deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar o horário da aula' });
    }
};


