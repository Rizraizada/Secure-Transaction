const express = require('express');
const router = express.Router();
const passport = require('../config/passport'); // Import Passport configuration

const authController = require('../controllers/authController');
const userController = require('../controllers/userController'); // Import userController


router.use(express.urlencoded({ extended: true }));

// GET request to display login form
router.get('/login', authController.getLogin);

router.get('/register', authController.register);

// POST request to handle login form submission
router.post('/login', authController.login);

// GET request to logout
router.get('/logout', authController.logout);
router.post('/logout', authController.logout); // Add this line

 
  
// POST request to handle registration form submission
router.post('/register', userController.register);
 
module.exports = router;
