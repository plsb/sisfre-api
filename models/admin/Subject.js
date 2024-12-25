const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Subject = sequelize.define('subject', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    acronym: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

module.exports = Subject;
