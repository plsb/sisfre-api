const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Class = require('../coordinator/Class');
const Subject = require('../admin/Subject');
const User = require('../admin/User');  // Assuming you have a User model for the professor

const ClassSchedule = sequelize.define('classSchedule', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    classId: {
        type: DataTypes.INTEGER,
        references: {
            model: Class,    // Reference to the Class model
            key: 'id',       // Foreign key to Class
        },
        onUpdate: 'CASCADE', // Update class ID if the class is updated
        onDelete: 'CASCADE', // Delete the schedule if the class is deleted
        allowNull: false,    // Class schedule must be linked to a class
    },
    subjectId: {
        type: DataTypes.INTEGER,
        references: {
            model: Subject,  // Reference to the Subject model
            key: 'id',       // Foreign key to Subject
        },
        onUpdate: 'CASCADE', // Update subject ID if the subject is updated
        onDelete: 'CASCADE', // Delete the schedule if the subject is deleted
        allowNull: false,    // Class schedule must be linked to a subject
    },
    shift: {
        type: DataTypes.ENUM('M', 'T', 'N'), // M: Morning, T: Afternoon, N: Night
        allowNull: false,                    // Shift is required
    },
    schedule: {
        type: DataTypes.ENUM('A', 'B', 'C', 'D', 'AB', 'CD'), // Class time (A, B, C, D, AB, CD)
        allowNull: false,                       // Schedule is required
    },
    professorId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,     // Reference to the User model (professor)
            key: 'id',       // Foreign key to User (professor)
        },
        onUpdate: 'CASCADE', // Update professor ID if the professor is updated
        onDelete: 'CASCADE', // Set professor to NULL if the professor is deleted
        allowNull: false,    // A class schedule must be linked to a professor
    },
    dayWeek: {
        type: DataTypes.ENUM('segunda', 'terca', 'quarta', 'quinta', 'sexta'), // Days of the week
        allowNull: false,    // Day of the week is required
    },
});

module.exports = ClassSchedule;
