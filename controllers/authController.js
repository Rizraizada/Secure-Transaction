const passport = require('../config/passport');
const User = require('../models/user'); // Corrected import path

exports.login = passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/login',
    failureFlash: true
});

exports.getLogin = (req, res) => {
    // Render the login form view
    res.render('login'); // Assuming you have a login.ejs file in your views directory
};

exports.register = (req, res) => {
    res.render('auth/register'); // Adjusted path to match the views/auth directory
};

exports.postRegister = async (req, res) => {
    try {
        // Extract username and password from request body
        const { username, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            req.flash('error', 'User already exists');
            return res.redirect('/register');
        }

        // Create a new user record in the database
        const newUser = await User.create({ username, password });

        // Redirect the user to login page after successful registration
        req.flash('success', 'User registered successfully');
        res.redirect('/login');
    } catch (error) {
        // Handle any errors and redirect to registration page with error message
        console.error('Error registering user:', error);
        req.flash('error', 'Failed to register user');
        res.redirect('/register');
    }
};

// authController.js

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.redirect('/login'); // Redirect to homepage or login page as needed
        }
        res.redirect('/login');
    });
};
