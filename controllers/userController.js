const User = require('../models/user');
const Transaction = require('../models/transaction');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 } // Limit file size to 1MB
}).single('photo');

// Controller to handle profile view
exports.profile = async (req, res) => {
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

        // Render the profile view with user and transaction data
        res.render('user/profile', {
            user,
            transactions,
            totalDeposit,
            totalWithdrawal,
            finalAmount,
            message: req.query.message || '' // Provide default empty string
        });

    } catch (error) {
        console.error('Error fetching user or transaction data:', error);
        res.status(500).send(`An error occurred while fetching profile data: ${error.message}`);
    }
};

// Controller to handle transaction list
exports.list = async (req, res) => {
    try {
        const user = req.user;
        const transactions = await Transaction.findAll({ where: { user_id: user.id } });

        res.render('user/transaction_list', {
            user,
            transactions
        });

    } catch (error) {
        console.error('Error fetching user or transaction data:', error);
        res.status(500).send(`An error occurred while fetching transaction data: ${error.message}`);
    }
};

// Controller to handle user registration
exports.register = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.error('Error occurred during file upload:', err);
                return res.status(500).send(`An error occurred during file upload: ${err.message}`);
            }

 
            const {
                username, last_name, date_of_birth, gender,
                father_name, mother_name, initial_deposit_amount,
                national_id, password, mobile_number, email_address,
                city, state, country, postal_Code, village_address,
                residential_address
            } = req.body;

            let photoPath = req.file ? req.file.path.replace(path.join(__dirname, '../public/'), '') : null;

            console.log('Photo path:', photoPath);

            const newUser = await User.create({
                username, last_name, date_of_birth, gender,
                father_name, mother_name, initial_deposit_amount,
                national_id, password, mobile_number, email_address,
                city, state, country, postal_code: postal_Code,
                village_address, residential_address,
                photo: photoPath
            });

 
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Error occurred during registration:', error);
        res.status(500).send(`An error occurred during registration: ${error.message}`);
    }
};
