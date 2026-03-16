import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('moderate');
  const [count, setCount] = useState('5');
  const [type, setType] = useState('mcq');
  const [isPageLoading, setIsPageLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

 if (isPageLoading) {
  return (
    <div className="neural-overlay">
      <div className="orbit-master">
        <div className="orbit-ring ring-1"></div>
        <div className="orbit-ring ring-2"></div>
        <div className="orbit-ring ring-3"></div>
        <div className="orbit-core">
          <span className="core-glow"></span>
        </div>
        <div className="loading-status">
          <h3>LOADING...</h3>
          <div className="status-bar"></div>
        </div>
      </div>
    </div>
  );
}
  return (
    <div className="home-wrapper animate-fade-in">
      <div className="home-header">
        <h1>SmartQuiz AI</h1>
      </div>

      <div className="card main-card">
        <div className="form-group">
          <label className="input-label">What do you want to test?</label>
          <div className="input-wrapper">
            <span className="input-icon">🎯</span>
            <input 
              type="text" 
              className="main-input"
              placeholder="Eg...AI, Python, Indian History, Data Structures" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
        </div>

        <div className="config-grid">
          <div className="form-group">
            <label className="input-label">Format</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="mcq">MCQ</option>
              <option value="msq">MSQ</option>
              <option value="boolean">True/False</option>
              <option value="short">Short Answer</option>
            </select>
          </div>

          <div className="form-group">
            <label className="input-label">Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="moderate">Medium</option>
              <option value="hard">Expert</option>
            </select>
          </div>

          <div className="form-group">
            <label className="input-label">Questions</label>
            <select value={count} onChange={(e) => setCount(e.target.value)}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>

        <button 
          className="btn-primary start-btn" 
          disabled={!topic.trim()}
          onClick={() => navigate(`/quiz?topic=${topic}&level=${level}&count=${count}&type=${type}`)}
        >
          LAUNCH QUIZ
        </button>
      </div>
    </div>
  );
};

export default Home;