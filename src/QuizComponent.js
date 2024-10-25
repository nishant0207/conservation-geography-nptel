import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';  // Import jsPDF
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

        // Calculate score based on the result
        data.result.forEach((res) => {
          if (res.correct) {
            calculatedScore++; // Only increment for correct answers
          }
        });

        setResult(data);
        setScore(calculatedScore); // Correct score now reflects the number of correct answers
        setSubmitted(true); // Mark the quiz as submitted
      })
      .catch((error) => {
        console.error('Error submitting quiz:', error);
      });
  };

  // Fetch correct answers before generating the PDF
  const fetchCorrectAnswersForPDF = async () => {
    if (!result && !submitted) {
      try {
        const response = await fetch(`https://conservation-geography-nptel.onrender.com/api/quiz/submit/${week}`, {
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
        });

        if (!response.ok) {
          throw new Error('Failed to fetch correct answers');
        }

        const data = await response.json();
        setResult(data); // Store the result for future use
        return data;
      } catch (error) {
        console.error('Error fetching correct answers:', error);
      }
    }
    return result;
  };

  // Function to generate PDF with questions and correct answers marked with an arrow, bold, and larger font size
  const generatePDF = async () => {
    const currentResult = await fetchCorrectAnswersForPDF(); // Fetch correct answers if not already available

    if (!currentResult) {
      console.error('No result available to generate PDF');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Week ${week} Quiz Questions`, 10, 10);

    let yPos = 30; // Initial Y position for the content

    questions.forEach((question, index) => {
      // Add question text
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const questionText = `${index + 1}. ${question.questionText}`;
      const splitQuestionText = doc.splitTextToSize(questionText, 180); // Split text to fit within page width
      doc.text(splitQuestionText, 10, yPos);
      yPos += splitQuestionText.length * 7 + 5; // Adjust yPos based on the height of the question text

      // Add options and highlight the correct answer
      question.options.forEach((option, optionIndex) => {
        if (yPos > 270) { 
          // Add new page if the content exceeds the page limit
          doc.addPage();
          yPos = 20;
        }

        const correctAnswerIndex = currentResult?.result?.[index]?.correctAnswer; // Fetch correct answer index

        // Format correct answer with different styling
        if (optionIndex === correctAnswerIndex) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          const correctText = `${String.fromCharCode(97 + optionIndex)}) ${option}  <--`;
          const splitCorrectText = doc.splitTextToSize(correctText, 180); // Ensure correct answer fits
          doc.text(splitCorrectText, 15, yPos);
        } else {
          // Normal formatting for other options
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0); // Normal black color for other options
          const optionText = `${String.fromCharCode(97 + optionIndex)}) ${option}`;
          const splitOptionText = doc.splitTextToSize(optionText, 180);
          doc.text(splitOptionText, 15, yPos);
        }

        yPos += 10; // Add space between options
      });

      yPos += 10; // Extra space between questions
    });

    doc.save(`Week_${week}_Quiz_Questions.pdf`);
  };

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to scroll to the bottom of the page
  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
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
      {/* Cross button */}
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

      {/* Download PDF Button */}
      {week !== 'final' && (
        <button className="submit-button" onClick={generatePDF}>
          Download Week {week} Questions as PDF
        </button>
      )}

      {/* Submit button */}
      {!submitted && questions.length > 0 && (
        <button className="submit-button" onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}

      {/* Display the total score */}
      {submitted && result && (
        <div className="results-section">
          <h2>Your Total Score: {score}/{result.totalQuestions}</h2>
        </div>
      )}

      {/* Scroll to Top and Scroll to Bottom Buttons */}
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