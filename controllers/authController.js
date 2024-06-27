const User = require('../models/User');
const Session = require('../models/Session');  // Import the Session model
const bcrypt = require('bcrypt');
const passport = require('passport');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.registerUser = async (req, res) => {
    const { name, email, password, password2 } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('register', {
            errors: errors.array(),
            name,
            email,
            password,
            password2
        });
    }

    if (password !== password2) {
        req.flash('error_msg', 'Passwords do not match');
        return res.redirect('/auth/register');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error_msg', 'Email already registered');
            return res.redirect('/auth/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Send success email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newUser.email,
            subject: 'Registration Successful',
            text: 'You have successfully registered!'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Something went wrong. Please try again.');
        res.redirect('/auth/register');
    }
};

exports.loginUser = (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error_msg', info.message);
            return res.redirect('/auth/login');
        }
        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }

            // Create a new session entry
            try {
                const newSession = new Session({
                    userId: user._id,
                    loginTime: new Date()
                });
                await newSession.save();
            } catch (error) {
                console.error(error);
            }

            req.flash('success_msg', 'Welcome back!');
            return res.redirect('/');
        });
    })(req, res, next);
};

exports.logoutUser = async (req, res) => {
    if (req.user) {
        try {
            // Find the most recent session and update the logout time
            await Session.findOneAndUpdate(
                { userId: req.user._id, logoutTime: null },
                { logoutTime: new Date() },
                { sort: { loginTime: -1 } }
            );
        } catch (error) {
            console.error(error);
            req.flash('error_msg', 'Something went wrong. Please try again.');
            return res.redirect('/');
        }
    }
    
    req.logout((err) => {
        if (err) {
            console.log(err);
            req.flash('error_msg', 'Something went wrong. Please try again.');
            return res.redirect('/');
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
};
