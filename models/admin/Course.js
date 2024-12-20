const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Assumindo que a configuração do Sequelize está aqui
const User = require('./User');

const Course = sequelize.define('course', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  acronym: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    //G - 'GRADUAÇÃO', T - 'TÉCNICO', I - 'INTEGRADO'
    type: DataTypes.ENUM('G', 'T', 'I'),
    allowNull: false,
  },
  coordinatorId: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // Modelo User
      key: 'id',   // Chave primária do User
    },
    onUpdate: 'CASCADE', // Atualiza automaticamente a chave estrangeira ao alterar o ID do coordenador
    onDelete: 'SET NULL', // Define como NULL caso o coordenador seja excluído
    allowNull: true,      // O curso pode ser criado sem um coordenador inicialmente
  },
});

module.exports = Course;
