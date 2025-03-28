import React, { useState, useEffect } from "react";
import "./FindDriverModal.css";

const FindDriverModal = ({ onCancel }) => {
  const [countdown, setCountdown] = useState(30);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      setProgress((prev) => (prev < 100 ? prev + 100 / 30 : 100));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="find-driver-modal">
        <span className="driver-emoji">🚖</span>
        <h2>Finding a Driver...</h2>
        <p>Hang tight! We're searching for a nearby driver.</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="timer">{countdown}s remaining</p>

        {/* Cancel Ride Button */}
        <button className="cancel-button" onClick={onCancel}>
          Cancel Ride
        </button>
      </div>
    </div>
  );
};

export default FindDriverModal;
