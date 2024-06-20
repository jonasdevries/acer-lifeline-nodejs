import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import User from '../models/user.js';
import PasswordResetToken from '../models/password_reset_token.js';
import sequelize from '../config/database.js'; // Ensure this is the path to your sequelize instance
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();

// Helper function to send emails
async function sendEmail(to, subject, text) {
    // Mailgun configuratie
    const mailgunAuth = {
        auth: {
            api_key: process.env.MAILGUN_API_KEY, // Haal de API-sleutel uit de .env-bestand
            domain: process.env.MAILGUN_DOMAIN // Haal het domein uit de .env-bestand
        }
    };

    const transporter = nodemailer.createTransport(mg(mailgunAuth));

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    });
}

// Create a new user
router.post('/admin/users', async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, email, role } = req.body;
        console.log('Creating user with name:', name, 'and email:', email);

        const user = await User.create({ name, email, role }, { transaction });
        console.log('User created:', user);

        // Create a password reset token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('Generated JWT token:', token);

        await PasswordResetToken.create({
            user_id: user.id,
            token,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }, { transaction });
        console.log('Password reset token stored in the database');

        // Construct the reset link
        const resetLink = `${process.env.HOSTNAME}/reset_password.html?token=${token}`;
        const emailText = `Beste ${name},

U bent uitgenodigd om deel te nemen aan onze webapp. Klik op de onderstaande link om uw wachtwoord in te stellen en toegang te krijgen:

${resetLink}

Met vriendelijke groet,
Het Webapp Team`;

        await sendEmail(email, 'Set Your Password', emailText);
        await transaction.commit(); // Commit the transaction if everything is successful
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);

        await transaction.rollback(); // Rollback the transaction in case of any error

        let errorMessage = 'An error occurred';
        if (error.name === 'SequelizeUniqueConstraintError') {
            errorMessage = 'A user with this email already exists';
        } else if (error.message === 'Failed to send email') {
            errorMessage = 'User created but failed to send email';
        } else {
            errorMessage = 'Failed to create user';
        }

        res.status(400).json({ error: errorMessage });
    }
});

// Get all users
router.get('/admin/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error); // Log the detailed error
        res.status(400).json({ error: error.message });
    }
});

// Update a user
router.put('/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update({ name, email, role });
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error); // Log the detailed error
        res.status(400).json({ error: error.message });
    }
});

// Delete a user
router.delete('/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error); // Log the detailed error
        res.status(400).json({ error: error.message });
    }
});

// Reset password
router.post('/password-reset/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const resetToken = await PasswordResetToken.findOne({ where: { token, user_id: payload.userId } });

        if (!resetToken || new Date() > resetToken.expires_at) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const user = await User.findByPk(payload.userId);
        const hashedPassword = bcrypt.hashSync(password, 10);
        await user.update({ password_hash: hashedPassword });

        // Delete the reset token after successful password reset
        await resetToken.destroy();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error); // Log the detailed error
        res.status(400).json({ error: error.message });
    }
});

// Mailgun configuratie
const mailgunAuth = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY, // Haal de API-sleutel uit de .env-bestand
        domain: process.env.MAILGUN_DOMAIN // Haal het domein uit de .env-bestand
    }
};

const transporter = nodemailer.createTransport(mg(mailgunAuth));

export default router;
