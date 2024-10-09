const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {check, validationResult } = require('express-validator')

// Render the register view
router.get('/register', (req, res) => {
  res.render('register', {csrfToken:req.csrfToken()});
});

// Handle register form submission
router.post('/register',  authController.register);

// Render the login view
router.get('/login', (req, res) => {
  res.render('login',{title: 'Login', body:'', csrfToken:req.csrfToken()});
});
// Handle login form submission
router.post('/login', authController.login);

// Handle logout
router.get('/logout', authController.logout);

module.exports = router;
