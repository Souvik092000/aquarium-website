const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

// Registration Route
router.get('/register', (req, res) => res.render('register'));
router.post('/register', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], authController.registerUser);

// Login Route
router.get('/login', (req, res) => res.render('login'));
router.post('/login', authController.loginUser);

// Logout Route
router.get('/logout', authController.logoutUser);

module.exports = router;
