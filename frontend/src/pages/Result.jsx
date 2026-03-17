import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const score = state?.score || 0;
  const total = state?.total || 5;
  const reportData = state?.reportData || [];
  const percentage = (score / total) * 100;

  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#22c55e', '#ffffff', '#de2525','#c7f60c']
      });
    }
  }, [percentage]);

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("SmartQuiz - Performance Report", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Score: ${score}/${total} (${percentage.toFixed(1)}%)`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 37);

    const tableRows = reportData.map((item, i) => [
      i + 1,
      item.question,
      Array.isArray(item.userAnswer) ? item.userAnswer.join(", ") : (item.userAnswer || "Skipped"),
      Array.isArray(item.correctAnswer) ? item.correctAnswer.join(", ") : item.correctAnswer,
      item.isCorrect ? "Correct" : "Incorrect"
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['#', 'Question', 'Your Answer', 'Correct Answer', 'Status']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      columnStyles: { 1: { cellWidth: 70 } }
    });

    doc.save(`SmartQuiz_Report_${Date.now()}.pdf`);
  };

  const getFeedback = () => {
    if (percentage === 100) return { msg: "Perfect! You're a Master!", color: "#22c55e", emoji: "🏆" };
    if (percentage >= 70) return { msg: "Great Job! Keep it up!", color: "#2563eb", emoji: "🌟" };
    if (percentage >= 40) return { msg: "Good effort! Practice more.", color: "#f59e0b", emoji: "📚" };
    return { msg: "Don't give up! Try again.", color: "#ef4444", emoji: "💪" };
  };

  const feedback = getFeedback();

  if (!state) return <div className="result-container">No Data Found. <button onClick={() => navigate('/')}>Go Home</button></div>;

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

        <p className="percentage-text">You scored <strong>{percentage.toFixed(0)}%</strong></p>

        <div className="action-buttons">
          <button className="btn-primary" onClick={() => navigate('/')}>
            TRY NEW TOPIC
          </button>
          
          <button className="btn-download" onClick={downloadReport}>
            DOWNLOAD REPORT ⬇️
          </button>
        </div>

        <div className="review-on-page">
           <h3><span>📝</span> Review Summary</h3>
           <div className="review-scroll-box">
             {reportData.map((item, i) => (
               <div key={i} className={`review-item ${item.isCorrect ? 'pass' : 'fail'}`}>
                  <p className="review-question"><strong>Q{i+1}:</strong> {item.question}</p>
                  <p className="review-user-ans">
                    Your Answer: <span>{Array.isArray(item.userAnswer) ? item.userAnswer.join(', ') : item.userAnswer}</span>
                  </p>
                  {!item.isCorrect && (
                    <p className="review-correct-ans">
                      Correct Answer: <span>{Array.isArray(item.correctAnswer) ? item.correctAnswer.join(', ') : item.correctAnswer}</span>
                    </p>
                  )}
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Result;