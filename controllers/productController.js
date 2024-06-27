const Product = require('../models/Product');
const multer = require('../config/multer');

// Display all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { products });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Unable to fetch products.');
        res.redirect('/');
    }
};

// Display add product page
exports.addProductPage = (req, res) => {
    res.render('addProduct');
};

// Handle add product
exports.addProduct = (req, res) => {
    multer(req, res, async (err) => {
        if (err) {
            console.error(err);
            req.flash('error_msg', 'Unable to upload images.');
            return res.redirect('/products/add');
        }

        const { name, description, price } = req.body;
        const imagePaths = req.files.map(file => '/uploads/' + file.filename);

        try {
            const newProduct = new Product({ name, description, price, images: imagePaths });
            await newProduct.save();
            req.flash('success_msg', 'Product added successfully');
            res.redirect('/products');
        } catch (error) {
            console.error(error);
            req.flash('error_msg', 'Unable to add product.');
            res.redirect('/products/add');
        }
    });
};

// Display single product page
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('singleProd', { product });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Unable to fetch product details.');
        res.redirect('/products');
    }
};

// Display edit product page
exports.editProductPage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('editProduct', { product });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Unable to fetch product details.');
        res.redirect('/products');
    }
};

// Handle edit product
exports.editProduct = (req, res) => {
    multer(req, res, async (err) => {
        if (err) {
            console.error(err);
            req.flash('error_msg', 'Unable to upload images.');
            return res.redirect('/products/edit/' + req.params.id);
        }

        const { name, description, price } = req.body;
        const imagePaths = req.files.map(file => '/uploads/' + file.filename);

        try {
            const product = await Product.findById(req.params.id);
            product.name = name;
            product.description = description;
            product.price = price;
            product.images = imagePaths.length > 0 ? imagePaths : product.images;
            await product.save();
            req.flash('success_msg', 'Product updated successfully');
            res.redirect('/products/' + req.params.id);
        } catch (error) {
            console.error(error);
            req.flash('error_msg', 'Unable to update product.');
            res.redirect('/products/edit/' + req.params.id);
        }
    });
};

// Handle delete product
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Product deleted successfully');
        res.redirect('/products');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Unable to delete product.');
        res.redirect('/products');
    }
};
