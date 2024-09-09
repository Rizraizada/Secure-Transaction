const User = require('../models/user');
const Transaction = require('../models/transaction');

// Dashboard function for admin
exports.dashboard = async (req, res) => {
   try {
        const user = req.user;
        user.photo = user.photo ? user.photo.replace('public/', '') : null;

        const transactions = await Transaction.findAll({ where: { user_id: user.id } });

        let totalDeposit = 0;
        let totalWithdrawal = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'deposit') {
                totalDeposit += transaction.amount;
            } else if (transaction.type === 'withdrawal') {
                totalWithdrawal += transaction.amount;
            }
        });

        const initialDeposit = user.initial_deposit_amount || 0;
        const finalAmount = initialDeposit + totalDeposit - totalWithdrawal;

        res.render('admin/dashboard', {
            user,
            transactions,
            totalDeposit,
            totalWithdrawal,
            finalAmount,
            message: req.query.message || ''
        });

    } catch (error) {
        console.error('Error fetching user or transaction data:', error);
        res.status(500).send(`An error occurred while fetching profile data: ${error.message}`);
    }
};

// Client list function for admin
// Client list function for admin
exports.clientList = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.findAll();
        let transactions = [];

        if (users.length) {
            // Fetch transactions for all users
            transactions = await Transaction.findAll({
                where: {
                    user_id: users.map(u => u.id) // Fetch transactions for all users
                }
            });
        }

        // Create a map of user transactions
        const userTransactionsMap = {};
        transactions.forEach(transaction => {
            if (!userTransactionsMap[transaction.user_id]) {
                userTransactionsMap[transaction.user_id] = [];
            }
            userTransactionsMap[transaction.user_id].push({
                type: transaction.type,
                amount: transaction.amount,
                date: new Date(transaction.createdAt).toDateString()
            });
        });

        // Render the client list with users and transactions
        res.render('admin/client_list', {
            users,
            userTransactionsMap, // Pass the map of user transactions
            message: req.query.message || ''
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send(`An error occurred: ${error.message}`);
    }
};


