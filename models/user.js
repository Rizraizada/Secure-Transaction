// Import Sequelize
const { DataTypes } = require('sequelize');

// Import the Sequelize instance (sequelize) created in your configuration file
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

// Define the User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    timestamps: false
});

// Hash password before saving to the database
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

// Export the User model
module.exports = User;
