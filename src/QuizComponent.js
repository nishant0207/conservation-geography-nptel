import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizComponent.css';

const QuizComponent = () => {
  const { week } = useParams();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [score, setScore] = useState(0); // State to track the total score
  const navigate = useNavigate();

  // Fetch quiz questions based on the week
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://conservation-geography-nptel.onrender.com/api/quiz/questions/${week}`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [week]);

  // Handle the user's answer selection
  const handleSelectAnswer = (questionIndex, selectedAnswer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedAnswer,
    }));
  };

  // Handle quiz submission
  const handleSubmit = () => {
    fetch(`https://conservation-geography-nptel.onrender.com/api/quiz/submit/${week}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userAnswers: Object.entries(userAnswers).map(([index, selectedAnswer]) => ({
          questionIndex: parseInt(index),
          selectedAnswer,
        })),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Submission failed');
        }
        return response.json();
      })
      .then((data) => {
        let calculatedScore = 0;
        data.result.forEach((res) => {
          if (res.correct) {
            calculatedScore++;
          }
        });

        setResult(data);
        setScore(calculatedScore);
        setSubmitted(true);
      })
      .catch((error) => {
        console.error('Error submitting quiz:', error);
      });
  };

  // Handle scroll visibility for scroll buttons
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      setShowScrollButtons(currentScrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error fetching questions: {error}</div>;
  }

  if (questions.length === 0) {
    return <div>No questions available for this week.</div>;
  }

  return (
    <div className="quiz-container">
      <button className="cross-button" onClick={() => navigate('/')}>
        &times;
      </button>

      <h1 className="quiz-title">{week === 'final' ? 'Final Quiz' : `Week ${week} Questions`}</h1>

      <div className="quiz-tiles">
        {questions.map((question, index) => {
          const correctAnswerIndex = result?.result?.[index]?.correctAnswer;
          const userSelectedAnswer = userAnswers[index];

          return (
            <div key={index} className="quiz-tile">
              <div className="question-text">
                <h3>Question {index + 1}:</h3>
                <p>{question.questionText}</p>
              </div>

              <div className="options-container">
                {question.options &&
                  question.options.map((option, optionIndex) => {
                    let optionClass = 'neutral';

                    if (submitted) {
                      if (optionIndex === correctAnswerIndex) {
                        optionClass = 'correct-answer'; // Highlight correct answer in green
                      }
                      if (userSelectedAnswer === optionIndex && userSelectedAnswer !== correctAnswerIndex) {
                        optionClass = 'incorrect-answer'; // Highlight selected wrong answer in red
                      }
                    }

                    return (
                      <label key={optionIndex} className={`option-label ${optionClass}`}>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optionIndex}
                          onChange={() => handleSelectAnswer(index, optionIndex)}
                          disabled={submitted}
                          checked={userAnswers[index] === optionIndex}
                        />
                        {option}
                      </label>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>

      {!submitted && questions.length > 0 && (
        <button className="submit-button" onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}

      {submitted && result && (
        <div className="results-section">
          <h2>Your Total Score: {score}/{result.totalQuestions}</h2>
        </div>
      )}

      {showScrollButtons && (
        <>
          <button className="scroll-to-top" onClick={scrollToTop}>
            ⬆
          </button>
          <button className="scroll-to-bottom" onClick={scrollToBottom}>
            ⬇
          </button>
        </>
      )}
    </div>
  );
};

export default QuizComponent;