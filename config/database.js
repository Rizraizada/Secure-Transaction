// Database configuration
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('secure_transaction', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
