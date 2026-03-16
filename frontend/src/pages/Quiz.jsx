import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Quiz = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topic = searchParams.get('topic');
  const level = searchParams.get('level');
  const count = searchParams.get('count');
  const type = searchParams.get('type');

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/quizzes/generate', { topic, level, count, type });
      setQuestions(res.data);
    } catch (err) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [topic, level, count, type, navigate]);

  useEffect(() => { fetchQuiz(); }, [fetchQuiz]);

  const handleSubmit = useCallback(() => {
    if (isRevealed) return;
    setIsRevealed(true);

    const current = questions[index];
    let isCorrect = false;

    if (type === 'mcq' || type === 'boolean') {
      isCorrect = selectedOptions[0] === current.correctAnswer;
    } else if (type === 'msq') {
      const sortedSelected = [...selectedOptions].sort();
      const sortedCorrect = [...current.correctAnswer].sort();
      isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
    } else if (type === 'short') {
      isCorrect = userInput.trim().toLowerCase() === current.correctAnswer.toLowerCase();
    }

    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex(i => i + 1);
        setSelectedOptions([]);
        setUserInput('');
        setIsRevealed(false);
        setTimeLeft(15);
      } else {
        navigate('/result', { state: { score: isCorrect ? score + 1 : score, total: questions.length } });
      }
    }, 2000);
  }, [questions, index, score, selectedOptions, userInput, type, isRevealed, navigate]);

  useEffect(() => {
    if (!loading && questions.length > 0 && !isRevealed) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, questions, index, isRevealed, handleSubmit]);

  const toggleOption = (opt) => {
    if (type === 'mcq' || type === 'boolean') {
      setSelectedOptions([opt]);
    } else {
      setSelectedOptions(prev => prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt]);
    }
  };
if (loading) {
  return (
    <div className="card generation-card animate-fade-in">
      <div className="pulse-container">
        <div className="pulse-ring"></div>
        <div className="pulse-ring"></div>
        <div className="pulse-icon">⚡</div>
      </div>
      <h2 className="gen-text">GENERATING QUIZ...</h2>
      <p className="gen-subtext">Our AI is synthesizing questions for you...</p>
      
      {/* Decorative status bar for extra "interest" */}
      <div className="gen-status-wrapper">
        <div className="gen-status-bar"></div>
      </div>
    </div>
  );
}

  const q = questions[index];

  return (
    <div className="card animate-fade-in">
      <div className="timer-container">
        <div className="timer-bar" style={{ width: `${(timeLeft / 15) * 100}%`, backgroundColor: timeLeft < 5 ? '#ef4444' : '#2563eb' }}></div>
      </div>

      <div className="quiz-header">
        <span>Question {index + 1}/{questions.length}</span>
        <span className="type-badge">{type.toUpperCase()}</span>
      </div>
      
      <h2 style={{ marginBottom: '20px' }}>{q.question}</h2>

      {type !== 'short' ? (
        <div className="option-list">
          {q.options.map((opt, i) => {
            let status = "";
            if (isRevealed) {
              const isRight = Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(opt) : q.correctAnswer === opt;
              status = isRight ? "correct" : (selectedOptions.includes(opt) ? "wrong" : "");
            }
            return (
              <button key={i} className={`btn-option ${selectedOptions.includes(opt) ? 'selected' : ''} ${status}`} onClick={() => toggleOption(opt)} disabled={isRevealed}>
                {type === 'msq' && <input type="checkbox" checked={selectedOptions.includes(opt)} readOnly />}
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="short-answer-container">
          <input type="text" className="main-input" placeholder="Type answer..." value={userInput} onChange={(e) => setUserInput(e.target.value)} disabled={isRevealed} />
          {isRevealed && <p className="correct-answer-text">Correct: {q.correctAnswer}</p>}
        </div>
      )}

      <button className="btn-primary" style={{ marginTop: '20px', width: '100%' }} onClick={handleSubmit} disabled={isRevealed || (type === 'short' ? !userInput : selectedOptions.length === 0)}>
        {isRevealed ? "Checking..." : "Submit Answer"}
      </button>
    </div>
  );
};

export default Quiz;