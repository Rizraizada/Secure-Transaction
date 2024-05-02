// Routes for user account management
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
 const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/profile', isAuthenticated, userController.profile);

 

module.exports = router;
