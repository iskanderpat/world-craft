import React, { useState, useEffect } from 'react';

const SessionTimer = ({ initialMinutes = 30, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`session-timer ${expired ? 'expired' : ''}`}>
      <div className="timer-display">
        <span className="timer-label">Time Remaining:</span>
        <span className="timer-value">{expired ? 'Expired' : formatTime()}</span>
      </div>
      {expired && (
        <div className="timer-expired-message">
          Your free session has expired. Extend with gems to continue!
        </div>
      )}
      {expired && (
        <button className="extend-session-btn">
          Extend Session (10 Gems)
        </button>
      )}
    </div>
  );
};

export default SessionTimer;