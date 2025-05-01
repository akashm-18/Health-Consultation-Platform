// app.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

// Middleware to enable CORS for your frontend
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware for JSON parsing
app.use(express.json());

console.log("Added consoles --- Akash M")

// Route to handle user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Login successful, return user data or a success message
    res.status(200).json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    console.error('Error during login: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running successfully.' });
});

// Export the app to be used in server.js
module.exports = app;
