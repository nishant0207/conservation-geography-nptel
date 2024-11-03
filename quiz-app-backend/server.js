const express = require('express');
const cors = require('cors');
import fetch from 'node-fetch';
import quizRoutes from './routes/quizRoutes';

// Initialize the app
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON requests
app.use(cors()); // To allow cross-origin requests

// Routes
app.use('/api/quiz', quizRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Self-pinging mechanism to prevent server from sleeping
const SELF_PING_INTERVAL = 14 * 60 * 1000; // Ping every 14 minutes
const SELF_URL = `https://conservation-geography-nptel.onrender.com/api/quiz/ping`; // Replace this with your actual deployed URL in production

setInterval(() => {
  fetch(SELF_URL)
    .then((res) => res.text())
    .then((text) => console.log(`Self-ping response: ${text}`))
    .catch((err) => console.error(`Self-ping error: ${err.message}`));
}, SELF_PING_INTERVAL);