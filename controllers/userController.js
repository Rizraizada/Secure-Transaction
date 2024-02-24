// Controller for user account management routes
const User = require('../models/user');

exports.profile = (req, res) => {
    res.render('user/profile', { user: req.user });
};

exports.deposit = (req, res) => {
    // Implement deposit logic
};

exports.withdraw = (req, res) => {
    // Implement withdraw logic
};
