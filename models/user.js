// Import Sequelize
const { DataTypes } = require('sequelize');

// Import the Sequelize instance (sequelize) created in your configuration file
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

// Define the User model
const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING, // Add a comma here
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    father_name: {
      type: DataTypes.STRING, // Add a comma here
      allowNull: true // Set allowNull to true
    },
    mother_name: {
      type: DataTypes.STRING, // Add a comma here
      allowNull: true // Set allowNull to true
    },
    initial_deposit_amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    national_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Add a comma here
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    city: {
      type: DataTypes.STRING, // Add a comma here
      allowNull: true // Set allowNull to true
    },
    state: {
      type: DataTypes.STRING, // Add a comma here
      allowNull: true // Set allowNull to true
    },
    country: {
      type: DataTypes.STRING, // Add a comma here
      allowNull: true // Set allowNull to true
    },
    postal_code: {
      type: DataTypes.STRING, // Add a comma here
      allowNull: true // Set allowNull to true
    },
    village_address: {
      type: DataTypes.TEXT, // Add a comma here
      allowNull: true // Set allowNull to true
    },
    residential_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false // Set allowNull to true
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    }
  });

// Hash password before saving to the database
User.beforeCreate(async (user, options) => {
    if (user && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Export the User model
module.exports = User;
