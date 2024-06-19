// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const morgan = require('morgan');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(bodyParser.json());
app.use(morgan('dev')); // Log HTTP requests

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// User registration endpoint
app.post('/register', async (req, res) => {
  const { userName, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (user_name, email, created_at, last_modified_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *',
      [userName, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login endpoint (simplified)
app.post('/login', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Logged in', user: result.rows[0] });
    } else {
      res.status(401).json({ message: 'Invalid email' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register device endpoint
app.post('/repairs', async (req, res) => {
  const { internalRef, serialNumber, description, createdBy, statusId } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO repairs (internal_ref, serial_number, description, created_at, created_by, last_modified_at, last_modified_by, status_id) VALUES ($1, $2, $3, NOW(), $4, NOW(), $4, $5) RETURNING *',
      [internalRef, serialNumber, description, createdBy, statusId]
    );
    res.status(201).json(result.rows[0]);

    // Send notification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'rma-center-email@example.com',
      subject: 'New Device Registered',
      text: `A new device has been registered: ${JSON.stringify(result.rows[0])}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get registered devices endpoint
app.get('/repairs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM repairs');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
