import React from "react";
import "./Modal.css";

const SignUpModal = ({
  signUpData,
  handleSignUpChange,
  handleSignUp,
  setShowSignUp,
  setSignUpData,
}) => (
  <div className="modal-overlay">
    <div className="login-modal">
      <h2>Sign Up</h2>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        className="input-field"
        value={signUpData.name}
        onChange={handleSignUpChange}
        autoFocus
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="input-field"
        value={signUpData.email}
        onChange={handleSignUpChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="input-field"
        value={signUpData.password}
        onChange={handleSignUpChange}
      />
      <button onClick={handleSignUp} className="login-btn">
        Sign Up
      </button>
      <button
        onClick={() => {
          setShowSignUp(false);
          setSignUpData({ name: "", email: "", password: "" });
        }}
        className="cancel-btn"
      >
        Cancel
      </button>
    </div>
  </div>
);

export default SignUpModal;
