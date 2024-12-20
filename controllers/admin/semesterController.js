const { Sequelize } = require('sequelize');
const Semester = require('../../models/admin/Semester');

// Registrar um novo semestre
exports.registerSemester = async (req, res) => {
  const { year, semester, type, status, start_date, end_date } = req.body;

  // Verificação de campos obrigatórios
  if (!year || !semester || !type || !start_date || !end_date) {
    return res.status(400).json({ error: 'Os campos (ano, semestre, tipo, data de início e data de término) são obrigatórios.' });
  }

  // Verificação se o semestre é "1" ou "2"
  if (!['1', '2'].includes(semester)) {
    return res.status(400).json({ error: 'O semestre deve ser "1" ou "2".' });
  }

  // Verificação se a data de início é menor que a data de término
  if (new Date(start_date) >= new Date(end_date)) {
    return res.status(400).json({ error: 'A data de início deve ser anterior à data de término.' });
  }

  try {
    // Verificar se já existe um semestre com o mesmo ano e tipo
    const existingSemester = await Semester.findOne({
      where: { year, type },
    });

    if (existingSemester) {
      return res.status(400).json({ error: 'Já existe um semestre cadastrado para este ano e tipo.' });
    }

    // Verificar se já existe um semestre com o mesmo ano e semestre (1 ou 2)
    const existingSemesterForThisSemester = await Semester.findOne({
      where: { year, semester },
    });

    if (existingSemesterForThisSemester) {
      return res.status(400).json({ error: 'Já existe um semestre cadastrado para este ano e semestre.' });
    }

    // Criar o novo semestre
    const newSemester = await Semester.create({
      year,
      semester,
      type,
      status,
      start_date,
      end_date,
    });

    res.status(201).json({ semester: newSemester });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar semestre.' });
  }
};

// Atualizar semestre
exports.updateSemester = async (req, res) => {
  const { year, semester, type, status, start_date, end_date } = req.body;
  const semesterId = parseInt(req.params.id, 10);

  // Verifica se pelo menos um campo foi fornecido para atualização
  if (!year && !semester && !type && status === undefined && !start_date && !end_date) {
    return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização.' });
  }

  try {
    // Verificar se o semestre existe
    const semesterToUpdate = await Semester.findByPk(semesterId);
    if (!semesterToUpdate) {
      return res.status(404).json({ error: 'Semestre não encontrado.' });
    }

    // Atualizar os campos, se fornecidos
    if (year) semesterToUpdate.year = year;
    if (semester) {
      if (!['1', '2'].includes(semester)) {
        return res.status(400).json({ error: 'O semestre deve ser "1" ou "2".' });
      }
      semesterToUpdate.semester = semester;
    }
    if (type) semesterToUpdate.type = type;
    if (status !== undefined) semesterToUpdate.status = status; // Verifica explicitamente para aceitar valores booleanos
    if (start_date) semesterToUpdate.start_date = start_date;
    if (end_date) semesterToUpdate.end_date = end_date;

    // Verificar se a data de início é menor que a data de término
    if (start_date && new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({ error: 'A data de início deve ser anterior à data de término.' });
    }

    // Verificar se já existe um semestre com o mesmo ano e tipo (ou semestre e ano)
    const existingSemester = await Semester.findOne({
      where: { year, type },
    });

    console.log("Semestre: ", semesterId, existingSemester.id)
    if (existingSemester && existingSemester.id !== semesterId) {
      return res.status(400).json({ error: 'Já existe um semestre cadastrado para este ano e tipo.' });
    }

    const existingSemesterForThisSemester = await Semester.findOne({
      where: { year, semester },
    });

    if (existingSemesterForThisSemester && existingSemesterForThisSemester.id !== semesterId) {
      return res.status(400).json({ error: 'Já existe um semestre cadastrado para este ano e semestre.' });
    }

    // Salvar alterações
    await semesterToUpdate.save();
    res.status(200).json({ message: 'Semestre atualizado com sucesso.', semester: semesterToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar semestre.' });
  }
};


// Listar semestres
exports.getSemesters = async (req, res) => {
  const { year } = req.query;

  try {
    let semesters;

    if (year) {
      // Busca semestres com base no ano
      semesters = await Semester.findAll({
        where: {
          year: {
            [Sequelize.Op.eq]: year,
          },
        },
      });
    } else {
      // Retorna todos os semestres
      semesters = await Semester.findAll();
    }

    res.json({ semesters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar semestres.' });
  }
};

// Buscar semestre por ID
exports.getSemesterById = async (req, res) => {
  const semesterId = req.params.id;

  try {
    const semester = await Semester.findByPk(semesterId);

    if (!semester) {
      return res.status(404).json({ error: 'Semestre não encontrado.' });
    }

    res.json({ semester });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar semestre.' });
  }
};

// Deletar semestre
exports.deleteSemester = async (req, res) => {
  const semesterId = req.params.id;

  try {
    const semester = await Semester.findByPk(semesterId);

    if (!semester) {
      return res.status(404).json({ error: 'Semestre não encontrado.' });
    }

    await semester.destroy();
    res.status(200).json({ message: 'Semestre deletado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar semestre.' });
  }
};
