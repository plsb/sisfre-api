const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Holiday = sequelize.define('holiday', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
});

module.exports = Holiday;
