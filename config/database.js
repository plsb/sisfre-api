const { Sequelize } = require('sequelize');
require('dotenv').config();

// Criando a instância do Sequelize com as variáveis de ambiente
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: console.log,  // Pode desativar o logging se não precisar ver as consultas no console
});

module.exports = sequelize;
