const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET request to display login form
router.get('/login', authController.getLogin);

router.get('/register', authController.register);

// POST request to handle login form submission
router.post('/login', authController.login);

// GET request to logout
router.get('/logout', authController.logout);

  
// POST request to handle registration form submission
router.post('/register', authController.postRegister);
 
module.exports = router;
