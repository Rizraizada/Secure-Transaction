const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Route to display user profile
router.get('/profile', isAuthenticated, userController.profile);

// Route to display transaction list
router.get('/transaction_list', isAuthenticated, userController.list);

module.exports = router;
