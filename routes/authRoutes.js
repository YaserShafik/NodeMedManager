const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Render the register view
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle register form submission
router.post('/register', authController.register);

// Render the login view
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login form submission
router.post('/login', authController.login);

module.exports = router;
