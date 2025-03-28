import React from "react";
import "./Modal.css";

const LoginModal = ({
  loginData,
  handleLoginChange,
  handleLogin,
  setShowLogin,
  setLoginData,
}) => (
  <div className="modal-overlay">
    <div className="login-modal">
      <h2>Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="input-field"
        value={loginData.email}
        onChange={handleLoginChange}
        autoFocus
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="input-field"
        value={loginData.password}
        onChange={handleLoginChange}
      />
      <button onClick={handleLogin} className="login-btn">
        Login
      </button>
      <button
        onClick={() => {
          setShowLogin(false);
          setLoginData({ email: "", password: "" });
        }}
        className="cancel-btn"
      >
        Cancel
      </button>
    </div>
  </div>
);

export default LoginModal;
