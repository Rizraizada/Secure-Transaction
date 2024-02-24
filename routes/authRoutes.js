const express = require('express');
const router = express.Router();
const passport = require('../config/passport'); // Import Passport configuration

const authController = require('../controllers/authController');

// GET request to display login form
router.get('/login', authController.getLogin);

router.get('/register', authController.register);

// POST request to handle login form submission
router.post('/login', authController.login);

// GET request to logout
router.get('/logout', authController.logout);
router.post('/logout', authController.logout); // Add this line

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    // Check user role and redirect accordingly
    if (req.user.role === 'admin') {
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/user/profile');
    }
});
  
// POST request to handle registration form submission
router.post('/register', authController.postRegister);
 
module.exports = router;
