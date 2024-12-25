const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Course = require('../admin/Course');
const Semester = require('../admin/Semester');

const Class = sequelize.define('class', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    courseId: {
        type: DataTypes.INTEGER,
        references: {
            model: Course,
            key: 'id',
        },
        onUpdate: 'CASCADE', // Atualiza automaticamente a chave estrangeira ao alterar o ID do curso
        onDelete: 'CASCADE', // Exclui a classe se o curso associado for excluído
        allowNull: false,    // Uma classe precisa estar associada a um curso
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false, // A descrição é obrigatória
    },
    semesterId: {
        type: DataTypes.INTEGER,
        references: {
            model: Semester, // Modelo Semester
            key: 'id',       // Chave primária do Semester
        },
        onUpdate: 'CASCADE', // Atualiza automaticamente a chave estrangeira ao alterar o ID do semestre
        onDelete: 'CASCADE', // Exclui a classe se o semestre associado for excluído
        allowNull: false,    // Uma classe precisa estar associada a um semestre
    },
});

module.exports = Class;
