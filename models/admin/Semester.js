const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Assumindo que a configuração do Sequelize está aqui

const Semester = sequelize.define('semester', {
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  semester: {
    type: DataTypes.ENUM('1', '2'), // Somente 1 ou 2
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN, // Campo booleano para status
    allowNull: false,
    defaultValue: false, // Padrão é "inativo" (false)
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = Semester;
