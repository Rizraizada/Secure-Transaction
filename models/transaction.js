const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the Transaction model
const Transaction = sequelize.define('Transaction', {
    id: { // Changed from Id to id
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    national_id: {
        type: DataTypes.STRING,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('deposit', 'withdrawal'),
        allowNull: false
    }
}, {
    timestamps: true
});

// Import User model here to avoid circular dependencies
const User = require('./user'); 

// Define associations
Transaction.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Transaction;
