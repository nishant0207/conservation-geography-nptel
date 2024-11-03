import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import quizRoutes from './routes/quizRoutes.js';

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/quiz', quizRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Self-pinging mechanism
const SELF_PING_INTERVAL = 14 * 60 * 1000;
const SELF_URL = `http://localhost:${PORT}/api/quiz/ping`;

setInterval(() => {
  fetch(SELF_URL)
    .then((res) => res.text())
    .then((text) => console.log(`Self-ping response: ${text}`))
    .catch((err) => console.error(`Self-ping error: ${err.message}`));
}, SELF_PING_INTERVAL);

app.get('/api/quiz/ping', (req, res) => {
  res.send('Pong');
});