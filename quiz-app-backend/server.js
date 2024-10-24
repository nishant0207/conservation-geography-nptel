const express = require('express');
const cors = require('cors');
const quizRoutes = require('./routes/quizRoutes'); // Correct path

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