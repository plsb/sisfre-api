const { Sequelize } = require('sequelize');
const SchoolSaturday = require('../../models/admin/SchoolSaturday');
const Semester = require('../../models/admin/Semester');

// Registrar um novo sábado escolar
exports.registerSchoolSaturday = async (req, res) => {
    const { date, weekday, semesterId } = req.body;

    // Verificação de dados obrigatórios
    if (!date || !weekday || !semesterId) {
        return res.status(400).json({ error: 'Os campos (data, dia da semana, semestre) são obrigatórios' });
    }

    // Validar o dia da semana
    if (!['segunda', 'terca', 'quarta', 'quinta', 'sexta'].includes(weekday)) {
        return res.status(400).json({ error: 'O dia da semana deve ser "segunda", "terca", "quarta", "quinta" ou "sexta"' });
    }

    try {
        // Verificar se o semestre existe
        const semester = await Semester.findByPk(semesterId);
        if (!semester) {
            return res.status(404).json({ error: 'Semestre não encontrado' });
        }

        const selectedDate = new Date(date);
        if (selectedDate.getDay() !== 5) {  // 5 representa sábado
            return res.status(400).json({ error: 'A data fornecida não é um sábado' });
        }

        // Verificar se já existe um sábado escolar registrado para o semestre e data fornecida
        const existingSaturday = await SchoolSaturday.findOne({
            where: { date, semesterId },
        });

        if (existingSaturday) {
            return res.status(400).json({ error: 'Já existe um sábado letivo registrado para esse semestre nesta data.' });
        }

        // Criar o sábado escolar
        const schoolSaturday = await SchoolSaturday.create({ date, weekday, semesterId });
        res.status(201).json({ schoolSaturday });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar sábado escolar' });
    }
};

// Atualizar sábado escolar
exports.updateSchoolSaturday = async (req, res) => {
    const { date, weekday, semesterId } = req.body;
    const schoolSaturdayId = req.params.id;

    if (!date && !weekday && !semesterId) {
        return res.status(400).json({ error: 'Pelo menos um campo (data, dia da semana, semestre) deve ser fornecido para atualização' });
    }

    try {
        // Verificar se o sábado escolar existe
        const schoolSaturday = await SchoolSaturday.findByPk(schoolSaturdayId);
        if (!schoolSaturday) {
            return res.status(404).json({ error: 'Sábado escolar não encontrado' });
        }

        // Verificar se o semestre existe e foi alterado
        if (semesterId) {
            const semester = await Semester.findByPk(semesterId);
            if (!semester) {
                return res.status(404).json({ error: 'Semestre não encontrado' });
            }
            schoolSaturday.semesterId = semesterId;
        }

        const selectedDate = new Date(date);
        if (selectedDate.getDay() !== 5) {  // 5 representa sábado
            return res.status(400).json({ error: 'A data fornecida não é um sábado' });
        }

        // Verificar se já existe um sábado escolar registrado para o semestre e data fornecida
        const existingSaturday = await SchoolSaturday.findOne({
            where: { date, semesterId },
        });

        if (existingSaturday && existingSaturday.id !== parseInt(schoolSaturdayId)) {
            return res.status(400).json({ error: 'Já existe um sábado letivo registrado para esse semestre nesta data.' });
        }

        // Atualizar os outros campos, se fornecidos
        if (date) schoolSaturday.date = date;
        if (weekday) {
            if (!['segunda', 'terca', 'quarta', 'quinta', 'sexta'].includes(weekday)) {
                return res.status(400).json({ error: 'O dia da semana deve ser "segunda", "terca", "quarta", "quinta" ou "sexta"' });
            }
            schoolSaturday.weekday = weekday;
        }

        // Salvar alterações
        await schoolSaturday.save();
        res.status(200).json({ message: 'Sábado escolar atualizado com sucesso', schoolSaturday });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar sábado escolar' });
    }
};

// Listar sábados escolares
// Listar sábados escolares
exports.getSchoolSaturdays = async (req, res) => {
    const { semesterId } = req.query;

    try {
        let schoolSaturdays;
        let semesters;

        // Fetch the list of semesters
        semesters = await Semester.findAll({
            attributes: ['id', 'year', 'semester', 'type'],
            order: [['year', 'ASC'], ['semester', 'ASC']], // Optional: sorts semesters by year and semester
        });

        if (semesterId) {
            // Filtra os sábados escolares pelo semestre
            schoolSaturdays = await SchoolSaturday.findAll({
                where: { semesterId },
                include: [
                    {
                        model: Semester,
                        as: 'semester', // Alias da associação
                        attributes: ['id', 'year', 'semester', 'type'],
                    },
                ],
                order: [['date', 'ASC']], // Ordena por data em ordem crescente
            });
        } else {
            // Retorna todos os sábados escolares
            schoolSaturdays = await SchoolSaturday.findAll({
                include: [
                    {
                        model: Semester,
                        as: 'semester', // Alias da associação
                        attributes: ['id', 'year', 'semester', 'type'],
                    },
                ],
                order: [['date', 'ASC']], // Ordena por data em ordem crescente
            });
        }

        res.json({
            schoolSaturdays,
            semesters,  // Adiciona os semestres ao retorno
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar sábados escolares' });
    }
};



// Buscar sábado escolar por ID
exports.getSchoolSaturdayById = async (req, res) => {
    const schoolSaturdayId = req.params.id;

    try {
        const schoolSaturday = await SchoolSaturday.findByPk(schoolSaturdayId, {
            include: [
                {
                    model: Semester,
                    attributes: ['id', 'year', 'semester', 'type'],
                },
            ],
        });

        if (!schoolSaturday) {
            return res.status(404).json({ error: 'Sábado escolar não encontrado' });
        }

        res.json({ schoolSaturday });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar sábado escolar' });
    }
};

// Deletar sábado escolar
exports.deleteSchoolSaturday = async (req, res) => {
    const schoolSaturdayId = req.params.id;

    try {
        // Procura o sábado escolar pelo ID
        const schoolSaturday = await SchoolSaturday.findByPk(schoolSaturdayId);

        if (!schoolSaturday) {
            // Retorna erro 404 se o sábado escolar não for encontrado
            return res.status(404).json({ error: 'Sábado escolar não encontrado.' });
        }

        // Exclui o sábado escolar
        await schoolSaturday.destroy();
        res.status(200).json({ message: 'Sábado escolar deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        // Retorna erro 500 em caso de falha
        res.status(500).json({ error: 'Erro ao deletar o sábado escolar.' });
    }
};