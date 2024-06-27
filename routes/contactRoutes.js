const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.get('/', contactController.getContactPage);
router.post('/', contactController.sendContactForm);

module.exports = router;