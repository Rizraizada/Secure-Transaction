const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

exports.deposit = async (req, res) => {
    try {
        const { user_id, national_id, deposit_amount } = req.body;

        await sequelize.query(
            `INSERT INTO transactions (user_id, national_id, amount, type) VALUES (?, ?, ?, ?)`,
            {
                replacements: [user_id, national_id, deposit_amount, 'deposit'],
                type: QueryTypes.INSERT
            }
        );

        res.redirect('/user/profile?type=deposit&message=Deposit%20transaction%20completed%20successfully');

    } catch (error) {
        console.error('Error in deposit transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Withdraw route
exports.withdraw = async (req, res) => {
    try {
        const { user_id, national_id, withdraw_amount } = req.body;

        await sequelize.query(
            `INSERT INTO transactions (user_id, national_id, amount, type) VALUES (?, ?, ?, ?)`,
            {
                replacements: [user_id, national_id, withdraw_amount, 'withdrawal'],
                type: QueryTypes.INSERT
            }
        );

        res.redirect('/user/profile?type=withdrawal&message=withdrawal%20transaction%20completed%20successfully');
    } catch (error) {
        console.error('Error in withdrawal transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};