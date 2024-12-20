const { Sequelize } = require('sequelize');
const User = require('../../models/admin/User');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Todos os campos (email, password, username) são obrigatórios' });
  }

  const accessType = "professor";

  try {
    // Verificar se já existe um usuário com o e-mail informado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado. Tente outro.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, accessType, username });
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
};

exports.updateUser = async (req, res) => {
  const { email, password, username } = req.body;
  const userId = req.params.id;

  if (!email && !password && !username) {
    return res.status(400).json({ error: 'Pelo menos um campo (email, password, username) deve ser fornecido para atualização' });
  }

  try {
    // Verificar se o usuário existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se o e-mail foi alterado e já existe outro usuário com o novo e-mail
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      
      if (existingUser) {
        return res.status(400).json({ error: 'E-mail já cadastrado. Tente outro.' });
      }
      // Atualizar o e-mail
      user.email = email;
    }

    // Se a senha foi fornecida, criptografá-la
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Atualizar o username, se fornecido
    if (username) {
      user.username = username;
    }

    // Salvar as alterações no banco de dados
    await user.save();

    res.status(200).json({ message: 'Usuário atualizado com sucesso', user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

exports.getUsers = async (req, res) => {
  const { username, page = 1, limit = 10, order = 'asc' } = req.query;

  try {
    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Set up the 'where' clause to exclude admins and optionally filter by username
    const where = {
      accessType: { [Sequelize.Op.ne]: 'admin' }, // Exclude users of type 'admin'
    };

    if (username) {
      // Add the username filter to the 'where' clause if 'username' is provided
      where.username = {
        [Sequelize.Op.like]: `%${username}%`, // Partial match for username
      };
    }

    // Use findAndCountAll to get both paginated data and total count
    const { rows, count } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [
        ['username', order === 'asc' ? 'ASC' : 'DESC'], // Sorting by username, either ascending or descending
      ],
    });

    // Return the paginated data along with the total count
    res.json({
      users: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit), // Calculate total pages
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id; 

  try {
    // Buscar o usuário pelo ID
    const user = await User.findByPk(userId);

    // Verificar se o usuário foi encontrado
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Retornar o usuário encontrado
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

// Deletar disciplina
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
      const user = await User.findByPk(userId);

      if (!user) {
          return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      await user.destroy();
      res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao deletar o usuário.' });
  }
};

