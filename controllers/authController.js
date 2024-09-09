const passport = require('../config/passport');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');


exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Check if the user is an admin or regular user
            if (user.role === 'admin') {
                return res.redirect('/admin/dashboard');
            }
            return res.redirect('/user/profile');
        });
    })(req, res, next);
};


exports.getLogin = (req, res) => {
     res.render('login');
};

exports.register = (req, res) => {
    res.render('auth/register');
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
