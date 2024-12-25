'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('schoolSaturdays', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      weekday: {
        type: Sequelize.ENUM('segunda', 'terca', 'quarta', 'quinta', 'sexta'),
        allowNull: false,
      },
      semesterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'semesters', // Nome da tabela que referencia (tabela Semester)
          key: 'id',
        },
        onUpdate: 'CASCADE', // Atualiza automaticamente a chave estrangeira
        onDelete: 'CASCADE', // Deleta as instâncias de schoolSaturday quando o semester for removido
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
    await queryInterface.dropTable('schoolSaturdays');
  },
};
