const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const bcrypt = require('bcryptjs');
const Course = require('./Course');

const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accessType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'professor',  // 'professor' ou 'admin'
  },
});

// Hook para gerar a senha hash antes de salvar no banco
User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

User.hasMany(Course, { foreignKey: 'coordinatorId', as: 'courses' });

module.exports = User;