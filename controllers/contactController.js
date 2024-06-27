const Contact = require('../models/contact');
const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Display contact page
exports.getContactPage = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error_msg', 'Please log in to view that resource');
        return res.redirect('/auth/login');
    }
    res.render('contact');
};

// Handle contact form submission
exports.sendContactForm = async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error_msg', 'Please log in to view that resource');
        return res.redirect('/auth/login');
    }

    const { name, email, message } = req.body;

    try {
        // Save contact information to the database
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        // Send an email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, 
            subject: 'New Customer Support Request',
            text: `You have received a new customer support request:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                req.flash('error_msg', 'Unable to send message. Please try again later.');
                res.redirect('/contact');
            } else {
                console.log('Email sent: ' + info.response);
                req.flash('success_msg', 'Message sent successfully.');
                res.redirect('/contact');
            }
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Something went wrong. Please try again.');
        res.redirect('/contact');
    }
};
