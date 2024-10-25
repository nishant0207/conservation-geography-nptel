const express = require('express');
const quizQuestions = require('./quizQuestions'); // Adjust the path if needed
const router = express.Router();

// Helper function to shuffle questions array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Route to get questions for a specific week/module
router.get('/questions/:week', (req, res) => {
  const week = req.params.week;

  // Check for 'final' in the request to serve all weeks
  if (week === 'final') {
    let allQuestions = Object.keys(quizQuestions).reduce((acc, weekKey) => {
      return acc.concat(quizQuestions[weekKey]);
    }, []);

    // Shuffle the questions before returning them
    allQuestions = shuffleArray(allQuestions);

    // Format the questions to send to the frontend
    const questions = allQuestions.map((q) => ({
      questionText: q.questionText,
      options: q.options,
    }));

    return res.json(questions);
  }

  // Ensure the quizQuestions has data for the requested week
  if (quizQuestions[`week${week}`]) {
    const questions = quizQuestions[`week${week}`].map((q) => ({
      questionText: q.questionText,
      options: q.options,
    }));
    res.json(questions);
  } else {
    res.status(404).json({ message: 'No questions found for this week' });
  }
});

// Route to submit answers and calculate score
router.post('/submit/:week', (req, res) => {
  const week = req.params.week;
  const { userAnswers } = req.body;

  let questions;

  // Handle final quiz (all weeks combined)
  if (week === 'final') {
    questions = Object.keys(quizQuestions).reduce((acc, weekKey) => acc.concat(quizQuestions[weekKey]), []);
  } else {
    questions = quizQuestions[`week${week}`];
  }

  if (!questions) {
    return res.status(404).json({ message: 'No questions found for this week' });
  }

  let score = 0;
  const result = [];

  questions.forEach((question, index) => {
    const selectedAnswer = userAnswers[index]?.selectedAnswer;

    // Check if the answer is undefined (unanswered question)
    if (selectedAnswer === undefined || selectedAnswer === null) {
      result.push({
        questionText: question.questionText,
        correctAnswer: question.correctAnswer,
        selectedAnswer: null, // mark as unanswered
        correct: false, // unanswered questions are not counted as correct or incorrect
      });
    } else {
      // Compare selectedAnswer with correctAnswer
      const isCorrect = selectedAnswer === question.correctAnswer;
      
      if (isCorrect) {
        score++; // Increment the score only if the answer is correct
      }

      result.push({
        questionText: question.questionText,
        correctAnswer: question.correctAnswer,
        selectedAnswer: selectedAnswer,
        correct: isCorrect,
      });
    }
  });

  // Return the total score and detailed result
  res.json({ score, totalQuestions: questions.length, result });
});

// Helper function to calculate the score
const calculateScore = (questions, userAnswers, res) => {
  let score = 0;
  const result = [];

  userAnswers.forEach((userAnswer, index) => {
    const question = questions[index];
    const isCorrect = question.correctAnswer === userAnswer.selectedAnswer;
    if (isCorrect) {
      score++;
    }
    result.push({
      questionText: question.questionText,
      correct: isCorrect,
      correctAnswer: question.correctAnswer,
      selectedAnswer: userAnswer.selectedAnswer,
    });
  });

  res.json({ score, totalQuestions: questions.length, result });
};

module.exports = router;