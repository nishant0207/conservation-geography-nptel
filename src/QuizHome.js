import React from 'react';
import { Link } from 'react-router-dom'; // For routing between pages
import './QuizHome.css'

const QuizHome = () => {
  return (
    <div className="quiz-home">
      <h1>NPTEL Conservation Geography</h1>
      <div className="weeks-list">
        {/* Looping through 12 weeks */}
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="week-item">
            <Link to={`/week/${i + 1}`}>Week {i + 1}</Link>
          </div>
        ))}
        {/* Link for the Final Quiz */}
        <div className="week-item">
          <Link to={`/week/final`}>Final Quiz</Link>
        </div>
      </div>
    </div>
  );
};

export default QuizHome;