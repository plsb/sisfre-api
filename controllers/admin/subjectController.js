const { Sequelize } = require('sequelize');
const Subject = require('../../models/admin/Subject');

// Registrar uma nova disciplina
exports.registerSubject = async (req, res) => {
    const { name, acronym } = req.body;

    // Verificação de campos obrigatórios
    if (!name || !acronym) {
        return res.status(400).json({ error: 'Os campos (nome e sigla) são obrigatórios.' });
    }

    try {
        // Verificar se já existe uma disciplina com a mesma sigla
        const existingSubject = await Subject.findOne({ where: { acronym } });

        if (existingSubject) {
            return res.status(400).json({ error: 'Já existe uma disciplina cadastrada com essa sigla.' });
        }

        // Criar a nova disciplina
        const newSubject = await Subject.create({
            name,
            acronym,
        });

        return res.status(201).json({ subject: newSubject });
    } catch (error) {
        console.error('Erro ao cadastrar disciplina:', error);
        return res.status(500).json({ error: 'Erro ao cadastrar disciplina. Tente novamente mais tarde.' });
    }
};


// Atualizar disciplina
exports.updateSubject = async (req, res) => {
    const { name, acronym } = req.body;
    const subjectId = parseInt(req.params.id, 10);

    // Verifica se pelo menos um campo foi fornecido para atualização
    if (!name && !acronym) {
        return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização.' });
    }

    try {
        // Verificar se a disciplina existe
        const subjectToUpdate = await Subject.findByPk(subjectId);
        if (!subjectToUpdate) {
            return res.status(404).json({ error: 'Disciplina não encontrada.' });
        }

        // Atualizar os campos, se fornecidos
        if (name) subjectToUpdate.name = name;
        if (acronym) {
            // Verificar se a sigla já existe
            const existingSubject = await Subject.findOne({ where: { acronym } });
            if (existingSubject && existingSubject.id !== subjectId) {
                return res.status(400).json({ error: 'Já existe uma disciplina cadastrada com essa sigla.' });
            }
            subjectToUpdate.acronym = acronym;
        }

        // Salvar alterações
        await subjectToUpdate.save();
        res.status(200).json({ message: 'Disciplina atualizada com sucesso.', subject: subjectToUpdate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar disciplina.' });
    }
};

// Listar disciplinas
exports.getSubjects = async (req, res) => {
    const { name } = req.query;

    try {
        let subjects;

        if (name) {
            // Se o parâmetro "name" for fornecido, busca as disciplinas pelo nome
            subjects = await Subject.findAll({
                where: {
                    name: {
                        [Sequelize.Op.like]: `%${name}%`, //  Usando iLike para busca insensível a maiúsculas/minúsculas
                    },
                },
            });
        } else {
            // Caso não haja o parâmetro "name", retorna todas as disciplinas
            subjects = await Subject.findAll();
        }

        res.json({ subjects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar disciplinas.' });
    }
};

// Buscar disciplina por ID
exports.getSubjectById = async (req, res) => {
    const subjectId = req.params.id;

    try {
        const subject = await Subject.findByPk(subjectId);

        if (!subject) {
            return res.status(404).json({ error: 'Disciplina não encontrada.' });
        }

        res.json({ subject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar disciplina.' });
    }
};

// Deletar disciplina
exports.deleteSubject = async (req, res) => {
    const subjectId = req.params.id;

    try {
        const subject = await Subject.findByPk(subjectId);

        if (!subject) {
            return res.status(404).json({ error: 'Disciplina não encontrada.' });
        }

        await subject.destroy();
        res.status(200).json({ message: 'Disciplina deletada com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar disciplina.' });
    }
};
