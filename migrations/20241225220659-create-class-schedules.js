'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('classSchedules', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      classId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'classes',  // Ensure 'classes' table exists
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      subjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subjects', // Ensure 'subjects' table exists
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      professorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',  // Ensure 'users' table exists
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',  // Set professor as NULL if user is deleted
      },
      shift: {
        type: Sequelize.ENUM('M', 'T', 'N'),
        allowNull: false,
      },
      schedule: {
        type: Sequelize.ENUM('A', 'B', 'C', 'D', 'AB', 'CD'),
        allowNull: false,
      },
      dayWeek: {
        type: Sequelize.ENUM('segunda', 'terca', 'quarta', 'quinta', 'sexta'),
        allowNull: false,
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
    await queryInterface.dropTable('classSchedules');
  },
};
