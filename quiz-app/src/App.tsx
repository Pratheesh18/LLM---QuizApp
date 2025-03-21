import React, { useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import QuestionList from './components/QuestionList';
import SubQuestionDisplay from './components/SubQuestionDisplay';
import { MainQuestion, SubQuestion } from './types';
import './App.css';

const App: React.FC = () => {
  // Hardcoded main questions (replace with API fetch later)
  const mainQuestions: MainQuestion[] = [
    { id: 1, text: 'Calculate the time of flight for a projectile launched at 20 m/s at 30 degrees to the horizontal.' },
    { id: 2, text: 'What is the pH of a 0.1 M HCl solution?' },
    { id: 3, text: 'Find the resultant force of two forces, 5N and 12N, acting at right angles.' },
  ];

  // State for selected question and subquestions
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [subQuestions, setSubQuestions] = useState<SubQuestion[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch subquestions from backend
  const fetchSubQuestions = async (question: string) => {
    setLoading(true);
    setError(null);
    setSubQuestions(null);
    setSelectedQuestion(question);

    try {
      const response = await axios.post('http://localhost:5000/generate-subquestions', {
        mainQuestion: question,
      });
      setSubQuestions(response.data.subquestions);
    } catch (err) {
      setError('Failed to fetch subquestions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Typography variant="h4" align="center" gutterBottom>
        A-Level Exam Practice
      </Typography>

      <QuestionList questions={mainQuestions} onQuestionClick={fetchSubQuestions} />
      <SubQuestionDisplay
        selectedQuestion={selectedQuestion}
        subQuestions={subQuestions}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default App;