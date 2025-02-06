const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure this points to your correct db connection file

// Define the Transaction model
const Transaction = sequelize.define('Transaction', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('credit', 'debit'),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
});

// Export the model
module.exports = Transaction;
