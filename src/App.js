import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QuizHome from './QuizHome';
import QuizComponent from './QuizComponent';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<QuizHome />} />
          <Route path="/week/:week" element={<QuizComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;