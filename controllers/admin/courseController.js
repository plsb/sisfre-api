const { Sequelize } = require('sequelize');
const Course = require('../../models/admin/Course');
const User = require('../../models/admin/User');

// Registrar um novo curso
exports.registerCourse = async (req, res) => {
  const { name, acronym, type, coordinatorId } = req.body;

  if (!name || !acronym || !type || !coordinatorId) {
    return res.status(400).json({ error: 'Os campos (nome, sigla, tipo, coordenador) são obrigatórios' });
  }

  if (!['G', 'T', 'I'].includes(type)) {
    return res.status(400).json({ error: 'O tipo do curso deve ser "G - GRADUAÇÃO", "T - TÉCNICO" ou "I - INTEGRADO"' });
  }

  try {
    // Verificar se já existe um curso com a sigla informada
    const existingCourse = await Course.findOne({ where: { acronym } });
    if (existingCourse) {
      return res.status(400).json({ error: 'Sigla já cadastrada. Tente outra.' });
    }

    // Validar o coordenador, se fornecido
    if (coordinatorId) {
      const coordinator = await User.findByPk(coordinatorId);
      if (!coordinator) {
        return res.status(404).json({ error: 'Coordenador não encontrado' });
      }
    }

    // Criar o curso
    const course = await Course.create({ name, acronym, type, coordinatorId });
    res.status(201).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar curso' });
  }
};

// Atualizar curso
exports.updateCourse = async (req, res) => {
  const { name, acronym, type, coordinatorId } = req.body;
  const courseId = req.params.id;

  if (!name && !acronym && !type && !coordinatorId) {
    return res.status(400).json({ error: 'Pelo menos um campo (nome, sigla, tipo, coordenador) deve ser fornecido para atualização' });
  }

  try {
    // Verificar se o curso existe
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    // Verificar se a sigla foi alterada e já existe outro curso com a nova sigla
    if (acronym && acronym !== course.acronym) {
      const existingCourse = await Course.findOne({ where: { acronym } });
      if (existingCourse) {
        return res.status(400).json({ error: 'Sigla já cadastrada. Tente outra.' });
      }
      course.acronym = acronym;
    }

    // Validar o coordenador, se fornecido
    if (coordinatorId) {
      const coordinator = await User.findByPk(coordinatorId);
      if (!coordinator) {
        return res.status(404).json({ error: 'Coordenador não encontrado' });
      }
      course.coordinatorId = coordinatorId;
    }

    // Atualizar os outros campos, se fornecidos
    if (name) course.name = name;
    if (type) {
      if (!['G', 'T', 'I'].includes(type)) {
        return res.status(400).json({ error: 'O tipo do curso deve ser "GRADUAÇÃO", "TÉCNICO" ou "INTEGRADO"' });
      }
      course.type = type;
    }

    // Salvar alterações
    await course.save();
    res.status(200).json({ message: 'Curso atualizado com sucesso', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar curso' });
  }
};

// Listar cursos
exports.getCourses = async (req, res) => {
  const { name } = req.query;

  try {
    let courses;

    if (name) {
      // Busca cursos com base no nome usando LIKE
      courses = await Course.findAll({
        where: {
          name: {
            [Sequelize.Op.like]: `%${name}%`,
          },
        },
        include: [
          {
            model: User,
            as: 'coordinator',
            attributes: ['id', 'username', 'email'],
          },
        ],
        order: [['name', 'ASC']], // Ordena os resultados por nome em ordem crescente
      });
    } else {
      // Retorna todos os cursos
      courses = await Course.findAll({
        include: [
          {
            model: User,
            as: 'coordinator',
            attributes: ['id', 'username', 'email'],
          },
        ],
        order: [['name', 'ASC']], // Ordena os resultados por nome em ordem crescente
      });
    }

    res.json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar cursos' });
  }
};


// Buscar curso por ID
exports.getCourseById = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: User,
          as: 'coordinator',  // Associação correta com o alias 'coordinator'
          attributes: ['id', 'username', 'email'],  // Seleção de campos do coordenador
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    // Estruturando a resposta para incluir coordenador corretamente
    const courseData = {
      id: course.id,
      name: course.name,
      acronym: course.acronym,
      type: course.type,
      coordinator: course.coordinator,  // Acessando os dados do coordenador
    };

    res.json({ course: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar curso' });
  }
};

exports.deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    // Procura o curso pelo ID
    const course = await Course.findByPk(courseId);

    if (!course) {
      // Retorna erro 404 se o curso não for encontrado
      return res.status(404).json({ error: 'Curso não encontrado.' });
    }

    // Exclui o curso
    await course.destroy();
    res.status(200).json({ message: 'Curso deletado com sucesso.' });
  } catch (error) {
    console.error(error);
    // Retorna erro 500 em caso de falha
    res.status(500).json({ error: 'Erro ao deletar o curso.' });
  }
};


