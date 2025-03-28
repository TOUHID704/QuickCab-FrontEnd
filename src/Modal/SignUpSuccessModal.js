import React from "react";
import "./Modal.css";

const SignUpSuccessModal = ({ setShowSignUpSuccess, setShowLogin }) => (
  <div className="modal-overlay">
    <div className="success-modal">
      <div className="success-message">
        <span className="checkmark">✔️</span>
        <h2>Sign Up Successful!</h2>
        <p>Successfully signed up. Please log in to continue.</p>
      </div>
      <button
        onClick={() => {
          setShowSignUpSuccess(false);
          setShowLogin(true);
        }}
        className="login-btn"
      >
        Hurray! Login
      </button>
    </div>
  </div>
);

export default SignUpSuccessModal;
