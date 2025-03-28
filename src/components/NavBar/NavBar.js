// NavBar.js
import React from "react";
import "./NavBar.css"; // Import NavBar specific styles

const NavBar = ({ setShowLogin, setShowSignUp, children }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-text">QuickCab</span>
        </div>

        {/* If children are passed (like buttons), render them */}
        <div className="auth-buttons">
          {children || (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className="login-btn-header"
              >
                Login
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className="signup-btn"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
