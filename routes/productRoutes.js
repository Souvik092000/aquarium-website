const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', productController.getAllProducts);
router.get('/add', ensureAuthenticated, productController.addProductPage);
router.post('/add', ensureAuthenticated, productController.addProduct);
router.get('/:id', productController.getProduct);
router.get('/edit/:id', ensureAuthenticated, productController.editProductPage);
router.post('/edit/:id', ensureAuthenticated, productController.editProduct);
router.post('/delete/:id', ensureAuthenticated, productController.deleteProduct);

module.exports = router;
