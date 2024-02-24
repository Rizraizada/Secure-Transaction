// Routes for user account management
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/profile', isAuthenticated, userController.profile);
router.post('/deposit', isAuthenticated, userController.deposit);
router.post('/withdraw', isAuthenticated, userController.withdraw);

module.exports = router;
