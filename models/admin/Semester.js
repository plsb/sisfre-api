const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Semester = sequelize.define('semester', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  semester: {
    type: DataTypes.ENUM('1', '2'), // Somente 1 ou 2 que representa primeiro ou segundo semestre
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
