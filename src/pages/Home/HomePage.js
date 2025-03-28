import "./HomePage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import { roleApi } from "../../api/authApi";
import { loginApi, signUpApi } from "../../api/authApi";
import LoginModal from "../../Modal/LoginModal";
import SignUpModal from "../../Modal/SignUpModal";
import SignUpSuccessModal from "../../Modal/SignUpSuccessModal";
import FindDriverModal from "../../Modal/FindDriverModal"; // Import the new modal

const HomePage = () => {
  const navigate = useNavigate();
  const [showFindDriver, setShowFindDriver] = useState(false);
  const [showSignUpSuccess, setShowSignUpSuccess] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUp = async () => {
    if (!isValidEmail(signUpData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await signUpApi(signUpData);
      if (response) {
        console.log("Sign up successful, navigating to login...");
        setShowSignUp(false);
        setSignUpData({ name: "", email: "", password: "" });
        setShowSignUpSuccess(true);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("Sign Up failed. Please try again.");
    }
  };

  const handleLogin = async () => {
    if (!isValidEmail(loginData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const loginPayload = {
      email: loginData.email,
      password: loginData.password,
    };

    try {
      const response = await loginApi(loginPayload);
      if (response) {
        console.log("Login successful, navigating to dashboard...");
        setLoginData({ email: "", password: "" });

        const email = loginPayload.email;
        const { data } = await roleApi(email);

        if (data?.includes("DRIVER") && data?.includes("RIDER")) {
          navigate("/driverdashboard");
        } else if (data?.includes("ADMIN") && data?.includes("RIDER")) {
          navigate("/admin");
        } else if (data?.includes("RIDER")) {
          navigate("/riderdashboard");
        }
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="app-container">
      <NavBar setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />

      <section className="hero-section">
        <div className="hero-content">
          <h1>Your Ride, Your Way</h1>
          <p>
            Get to your destination safely and comfortably with our reliable
            ride-sharing service.
          </p>
          <div className="cta-buttons">
            <button className="cta-btn">Get a Ride</button>
            <button
              className="cta-btn secondary"
              onClick={() => console.log("Handle Become a driver")}
            >
              Become a Driver
            </button>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-icon">🚗</div>
            <div className="feature-title">Fast Rides</div>
            <div className="feature-description">
              Get to your destination faster with our optimized routes.
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <div className="feature-title">Affordable</div>
            <div className="feature-description">
              Enjoy budget-friendly prices with no hidden fees.
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🌍</div>
            <div className="feature-title">Available Everywhere</div>
            <div className="feature-description">
              Our service is available in cities across the globe.
            </div>
          </div>
        </div>
      </section>

      {showLogin && (
        <LoginModal
          loginData={loginData}
          handleLoginChange={handleLoginChange}
          handleLogin={handleLogin}
          setShowLogin={setShowLogin}
          setLoginData={setLoginData}
        />
      )}

      {showSignUp && (
        <SignUpModal
          signUpData={signUpData}
          handleSignUpChange={handleSignUpChange}
          handleSignUp={handleSignUp}
          setShowSignUp={setShowSignUp}
          setSignUpData={setSignUpData}
        />
      )}

      {showSignUpSuccess && (
        <SignUpSuccessModal
          setShowSignUpSuccess={setShowSignUpSuccess}
          setShowLogin={setShowLogin}
        />
      )}

      {showFindDriver && (
        <FindDriverModal setShowFindDriver={setShowFindDriver} />
      )}
    </div>
  );
};

export default HomePage;
