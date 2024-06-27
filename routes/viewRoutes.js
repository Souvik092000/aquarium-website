const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');

router.get('/', (req, res) => res.render('home'));
router.get('/about', (req, res) => res.render('about'));
router.get('/products', productController.getAllProducts); // Correct route for fetching products
router.get('/contact', (req, res) => res.render('contact'));
router.get('/cart', ensureAuthenticated, (req, res) => res.render('cart'));
router.get('/addProduct', ensureAuthenticated, (req, res) => res.render('addProduct'));
router.get('/profile', ensureAuthenticated, userController.getUserProfile);

module.exports = router;
