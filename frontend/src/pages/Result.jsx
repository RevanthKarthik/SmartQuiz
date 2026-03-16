import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const score = state?.score || 0;
  const total = state?.total || 5;
  const percentage = (score / total) * 100;

  useEffect(() => {
    // Fire confetti if score is more than 70%
    if (percentage >= 70) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#22c55e', '#ffffff']
      });
    }
  }, [percentage]);

  const getFeedback = () => {
    if (percentage === 100) return { msg: "Perfect! You're a Master!", color: "#22c55e", emoji: "🏆" };
    if (percentage >= 70) return { msg: "Great Job! Keep it up!", color: "#2563eb", emoji: "🌟" };
    if (percentage >= 40) return { msg: "Good effort! Practice more.", color: "#f59e0b", emoji: "📚" };
    return { msg: "Don't give up! Try again.", color: "#ef4444", emoji: "💪" };
  };

  const feedback = getFeedback();

  return (
    <div className="result-container animate-fade-in">
      <div className="result-card">
        <div className="badge-icon animate-bounce-slow">{feedback.emoji}</div>
        <h1 style={{ color: feedback.color }}>{feedback.msg}</h1>
        
        <div className="score-circle">
          <div className="score-text">
            <span className="big-score">{score}</span>
            <span className="total-score">/{total}</span>
          </div>
        </div>

        <p className="percentage-text">You scored <strong>{percentage}%</strong></p>

        <div className="action-buttons">
  <button className="btn-primary" onClick={() => navigate('/')}>
    TRY NEW TOPIC
  </button>
  
  <button className="btn-download" onClick={() => window.print()}>
    ⬇️
  </button>
</div>
        </div>
      </div>
  );
};

export default Result;