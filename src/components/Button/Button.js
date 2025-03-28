// Button.js
import React from "react";
import "./Button.css"; // Import the Button specific styles

const Button = ({ onClick, className, children }) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
