const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Semester = require('./Semester');

const SchoolSaturday = sequelize.define('schoolSaturday', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    weekday: {
        type: DataTypes.ENUM('segunda', 'terca', 'quarta', 'quinta', 'sexta'), // Somente esses dias da semana
        allowNull: false,
    },
    semesterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Semester,
            key: 'id',
        },
    },
});

module.exports = SchoolSaturday;
