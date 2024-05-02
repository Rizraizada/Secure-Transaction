const passport = require('../config/passport');
const User = require('../models/user'); // Corrected import path
const path = require('path'); // Import the path module
const fs = require('fs');
exports.login = passport.authenticate('local', {


    successRedirect: '/user/profile',
    failureRedirect: '/login',
    failureFlash: true
});

exports.getLogin = (req, res) => {
     res.render('login'); // Assuming you have a login.ejs file in your views directory
};

exports.register = (req, res) => {
    res.render('auth/register'); // Adjusted path to match the views/auth directory
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
