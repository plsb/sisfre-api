const { Sequelize } = require('sequelize');
const Holiday = require('../../models/admin/Holiday');

// Registrar um novo feriado
exports.registerHoliday = async (req, res) => {
    const { name, date } = req.body;

    // Verificação de campos obrigatórios
    if (!name || !date) {
        return res.status(400).json({ error: 'Os campos (nome e data) são obrigatórios.' });
    }

    try {
        // Verificar se já existe um feriado com a mesma data
        const existingHoliday = await Holiday.findOne({ where: { date } });

        if (existingHoliday) {
            return res.status(400).json({ error: 'Já existe um feriado cadastrado para essa data.' });
        }

        // Criar o novo feriado
        const newHoliday = await Holiday.create({
            name,
            date,
        });

        return res.status(201).json({ holiday: newHoliday });
    } catch (error) {
        console.error('Erro ao cadastrar feriado:', error);
        return res.status(500).json({ error: 'Erro ao cadastrar feriado. Tente novamente mais tarde.' });
    }
};

// Atualizar feriado
exports.updateHoliday = async (req, res) => {
    const { name, date } = req.body;
    const holidayId = parseInt(req.params.id, 10);

    if (!name && !date) {
        return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização.' });
    }

    try {
        // Verificar se o feriado existe
        const holidayToUpdate = await Holiday.findByPk(holidayId);
        if (!holidayToUpdate) {
            return res.status(404).json({ error: 'Feriado não encontrado.' });
        }

        // Atualizar os campos, se fornecidos
        if (name) holidayToUpdate.name = name;
        if (date) {
            // Verificar se a data já está cadastrada
            const existingHoliday = await Holiday.findOne({ where: { date } });
            if (existingHoliday && existingHoliday.id !== holidayId) {
                return res.status(400).json({ error: 'Já existe um feriado cadastrado para essa data.' });
            }
            holidayToUpdate.date = date;
        }

        await holidayToUpdate.save();
        res.status(200).json({ message: 'Feriado atualizado com sucesso.', holiday: holidayToUpdate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar feriado.' });
    }
};

// Listar feriados
exports.getHolidays = async (req, res) => {
    const { name } = req.query;

    try {
        let holidays;

        if (name) {
            holidays = await Holiday.findAll({
                where: {
                    name: {
                        [Sequelize.Op.like]: `%${name}%`,
                    },
                },
                order: [['date', 'DESC']], // Add order by date descending
            });
        } else {
            holidays = await Holiday.findAll({
                order: [['date', 'DESC']], // Add order by date descending
            });
        }

        res.json({ holidays });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar feriados.' });
    }
};


// Buscar feriado por ID
exports.getHolidayById = async (req, res) => {
    const holidayId = req.params.id;

    try {
        const holiday = await Holiday.findByPk(holidayId);

        if (!holiday) {
            return res.status(404).json({ error: 'Feriado não encontrado.' });
        }

        res.json({ holiday });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar feriado.' });
    }
};

// Deletar feriado
exports.deleteHoliday = async (req, res) => {
    const holidayId = req.params.id;

    try {
        const holiday = await Holiday.findByPk(holidayId);

        if (!holiday) {
            return res.status(404).json({ error: 'Feriado não encontrado.' });
        }

        await holiday.destroy();
        res.status(200).json({ message: 'Feriado deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar feriado.' });
    }
};
