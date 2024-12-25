const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/admin/User');
const Course = require('../models/admin/Course');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Verifica se o email e a senha foram enviados
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    const course = await Course.findOne({
      where: {
        coordinatorId: user.id
      }
    });

    const token = jwt.sign(
        {
          id: user.id,
          accessType: course ? 'coordinator' : user.accessType
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};
