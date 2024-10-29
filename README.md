NPTEL Conservation Geography Quiz App

This project is a Quiz Application for the NPTEL Conservation Geography course. It allows users to take weekly quizzes and a final comprehensive quiz, view scores, and download questions with correct answers as a PDF. The app is built with a Node.js backend and a React frontend.

Project Structure

Here’s an overview of the project’s structure:

quiz-app
├── node_modules
├── public
├── quiz-app-backend
│   ├── node_modules
│   ├── routes
│   │   ├── quizQuestions.js         # Contains quiz questions data for each week
│   │   └── quizRoutes.js            # Defines backend API routes for questions and submission
│   ├── package.json                 # Backend dependencies and scripts
│   ├── package-lock.json
│   └── server.js                    # Express server configuration
├── src
│   ├── App.css                      # Main styling for the app
│   ├── App.js                       # Main React app component with routing configuration
│   ├── App.test.js                  # Test file for the app component
│   ├── QuizComponent.js             # Quiz component displaying questions and options
│   ├── QuizComponent.css            # Styles for the Quiz component
│   ├── QuizHome.js                  # Home component with links to weekly quizzes
│   ├── QuizHome.css                 # Styles for the home component
│   ├── index.css                    # Base styles for the app
│   ├── index.js                     # Entry point for React application
│   ├── reportWebVitals.js           # Utility for measuring app performance
│   ├── setupTests.js                # Configuration for testing setup
│   ├── logo.svg                     # Application logo
├── .gitignore                       # Files to ignore in git
├── package.json                     # Project dependencies and scripts
├── package-lock.json
└── README.md                        # Project documentation

Features

	•	Weekly Quiz: Allows users to select and attempt quizzes for individual weeks.
	•	Final Quiz: Combines questions from all weeks into a single final quiz.
	•	Answer Validation: Checks user answers and calculates scores.
	•	PDF Generation: Allows users to download questions and correct answers as a PDF.
	•	Smooth Navigation: Provides navigation between weekly quizzes and home.
	•	Scroll Navigation: Scroll-to-top and scroll-to-bottom buttons for ease of access on long pages.

Installation

	1.	Clone the Repository:

git clone https://github.com/yourusername/quiz-app.git
cd quiz-app


	2.	Backend Setup:
	•	Navigate to the quiz-app-backend folder.

cd quiz-app-backend

	•	Install dependencies:

npm install

	•	Start the backend server:

npm start

The server will run on http://localhost:5001 by default.

	3.	Frontend Setup:
	•	Navigate to the root quiz-app folder.

cd ..

	•	Install dependencies:

npm install

	•	Start the frontend:

npm start

The app will run on http://localhost:3000 by default.

Usage

	1.	Navigate to the Home Page:
	•	Access http://localhost:3000 in your browser.
	•	You will see a list of weeks available to quiz on and a final quiz option.
	2.	Take a Quiz:
	•	Click on any week or the final quiz to start answering questions.
	•	Each question has multiple-choice options. Select one option per question.
	3.	Submit Quiz:
	•	Once you’ve answered all questions, click Submit Quiz.
	•	Your score and a detailed breakdown of correct/incorrect answers will be displayed.
	4.	Download PDF:
	•	If you’d like a PDF version of the questions with correct answers marked, click the Download Week X Questions as PDF button (available for weekly quizzes).

API Endpoints

1. Get Questions for a Week

Endpoint: GET /api/quiz/questions/:week

Parameters:

	•	week: Number of the week (e.g., 1, 2, …) or final for the combined quiz.

Response:

	•	JSON array of questions with questionText and options.

2. Submit Answers

Endpoint: POST /api/quiz/submit/:week

Parameters:

	•	week: Number of the week or final.
	•	userAnswers: Array of objects with questionIndex and selectedAnswer.

Response:

	•	JSON object with score, totalQuestions, and result (details of each question with correct and selected answers).

Code Explanation

Backend (Node.js with Express)

	•	quizQuestions.js: Stores questions for each week.
	•	quizRoutes.js: Defines routes for fetching questions and submitting answers.
	•	server.js: Configures and starts the Express server, handles routing.

Frontend (React)

	•	QuizHome.js: Home component displaying links to weekly quizzes.
	•	QuizComponent.js: Quiz component that fetches questions, displays them, and allows answer submission.
	•	App.js: Configures routing between QuizHome and QuizComponent.
	•	PDF Generation: jsPDF library is used to create PDFs with questions and correct answers marked.

Dependencies

Backend Dependencies

	•	Express: For creating the REST API.
	•	CORS: To handle cross-origin requests.

Frontend Dependencies

	•	React: For building the UI.
	•	React Router: For navigating between quiz weeks.
	•	jsPDF: For generating PDFs with questions and answers.

Future Improvements

	•	User Authentication: Allow users to sign in and save progress.
	•	Score History: Track and display users’ scores over time.
	•	Timed Quizzes: Introduce a timer for each quiz.
	•	Improved UI: Add animations and improve responsiveness.

License

This project is open source and available under the MIT License.
