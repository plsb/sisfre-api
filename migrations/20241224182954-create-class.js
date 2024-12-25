'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('classes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      courseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'courses', // Nome da tabela que referencia (tabela Course)
          key: 'id',
        },
        onUpdate: 'CASCADE', // Atualiza automaticamente a chave estrangeira
        onDelete: 'CASCADE', // Deleta as classes associadas se o curso for removido
        allowNull: false,    // Uma classe precisa estar associada a um curso
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false, // A descrição é obrigatória
      },
      semesterId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'semesters', // Nome da tabela que referencia (tabela Semester)
          key: 'id',
        },
        onUpdate: 'CASCADE', // Atualiza automaticamente a chave estrangeira
        onDelete: 'CASCADE', // Deleta as classes associadas se o semestre for removido
        allowNull: false,    // Uma classe precisa estar associada a um semestre
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('classes');
  },
};
