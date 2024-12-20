const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Assumindo que a configuração do Sequelize está aqui

const Subject = sequelize.define('subject', {
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
