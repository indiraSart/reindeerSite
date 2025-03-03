// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const reindeerRoutes = require('./routes/reindeerRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, 'frontend'))); // Serve static frontend files

// API Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/reindeer', reindeerRoutes); // Reindeer-related routes

// Fallback to index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));

// Global Error Handler
app.use(errorHandler);

// .env example
// PORT=3000
// MONGO_URI=mongodb://localhost:27017/reindeerDB
// JWT_SECRET=supersecretkey
