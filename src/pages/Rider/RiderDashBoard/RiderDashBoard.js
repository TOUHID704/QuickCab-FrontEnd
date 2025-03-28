import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RiderDashBoard.css";
import { getRiderProfile } from "../../../api/riderApi";
import { logOutApi } from "../../../api/authApi"; // Import logOut API function
import BookingRide from "../BookingRide/BookingRide";

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await getRiderProfile();
        if (response?.data?.user?.name) {
          setUserName(response.data.user.name);
        } else {
          setUserName("Unknown User");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setUserName("Error");
      }
    };

    fetchUserName();
  }, []);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleRideButton = () => {
    navigate("/ridePage");
  };

  const handleWallet = () => {
    navigate("/riderWallet")
  };

  const handleManageProfile = () => {
    navigate("/userprofile");
  };

  const handleSignOut = async () => {
    try {
      const response = await logOutApi();
      if (response) {
        console.log("User logged out successfully");
        navigate("/"); // Redirect to login page after sign-out
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred while logging out.");
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">QuickCab</span>
          </div>
          <div className="auth-buttons">
            <button className="login-btn-header" onClick={toggleOptions}>
              {userName}
            </button>
          </div>
        </div>
        {showOptions && (
          <div className="modal-options">
            <ul>
              <li onClick={handleRideButton}>Rides</li>
              <li onClick={handleManageProfile}>Profile</li>
              <li onClick={handleWallet}>Wallet</li>
              <li onClick={handleSignOut}>Sign Out</li> {/* Logout Option */}
            </ul>
          </div>
        )}
      </header>
      <BookingRide />
    </div>
  );
};

export default RiderDashboard;
