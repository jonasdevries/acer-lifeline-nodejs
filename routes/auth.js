import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/user.js';
import transporter from '../config/mailer.js';
import chalk from 'chalk';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const activationCode = crypto.randomBytes(20).toString('hex');
        const newUser = await User.create({ email, password: hashedPassword, activationCode });

        const activationUrl = `http://localhost:3000/auth/activate/${activationCode}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Activate your account',
            text: `Please click the following link to activate your account: ${activationUrl}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(chalk.red('Error sending email:'), err);
                return res.status(500).send('Error registering new user.');
            }
            console.log(chalk.green('User registered! Activation email sent to:'), email);
            res.status(201).send('User registered! Please check your email to activate your account.');
        });
    } catch (err) {
        console.error(chalk.red('Error registering new user:'), err);
        res.status(500).send('Error registering new user.');
    }
});

router.get('/activate/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const user = await User.findOne({ where: { activationCode: code } });
        if (!user) {
            console.error(chalk.red('Invalid activation code.'));
            return res.status(400).send('Invalid activation code.');
        }
        user.isActive = true;
        user.activationCode = null; // Remove the activation code
        await user.save();
        console.log(chalk.green('Account activated for user:'), user.email);
        res.send('Account activated! You can now log in.');
    } catch (err) {
        console.error(chalk.red('Error activating account:'), err);
        res.status(500).send('Error activating account.');
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(chalk.red('Error during authentication:'), err);
            return next(err);
        }
        if (!user) {
            console.warn(chalk.yellow('Login failed: Invalid email or password'));
            return res.status(401).send('Invalid email or password');
        }
        if (!user.isActive) {
            console.warn(chalk.yellow('Login failed: Account not activated'));
            return res.status(401).send('Account not activated. Please check your email.');
        }

        req.logIn(user, err => {
            if (err) {
                console.error(chalk.red('Error during login:'), err);
                return next(err);
            }
            console.log(chalk.green('Login successful for user:'), user.email);
            return res.status(200).send('Login successful');
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    console.log(chalk.green('User logged out.'));
    res.redirect('/auth/login');
});

export default router;
