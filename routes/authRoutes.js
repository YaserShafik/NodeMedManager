const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {check, validationResult } = require('express-validator')

// Render the register view
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle register form submission
router.post('/register',  authController.register);

// Render the login view
router.get('/login', (req, res) => {
  console.log("Get a login get")
  res.render('login',{title: 'Login', body:''});
});

// Handle login form submission
router.post('/login', authController.login);

// Handle logout
router.get('/logout', authController.logout);

module.exports = router;
