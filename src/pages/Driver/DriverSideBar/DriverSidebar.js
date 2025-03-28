import "../DriverSideBar/DriverSidebar.css";

import React from "react";
import { useNavigate } from "react-router-dom";
import { logOutApi } from "../../../api/authApi";

const DriverSidebar = () => {
  const navigate = useNavigate();

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
    <div className="sidebar">
      <h2>Driver Dashboard</h2>
      <div
        className="menu-item"
        onClick={() => navigate("/driverRideRequests")}
      >
        Ride Requests
      </div>
      <div className="menu-item" onClick={() => navigate("/activeRide")}>
        Active Ride
      </div>
      <div className="menu-item" onClick={() => navigate("/driverRideHistory")}>
        Ride History
      </div>
      <div className="menu-item" onClick={() => navigate("/wallet")}>
        Wallet
      </div>
      <div className="menu-item" onClick={() => navigate("/driverProfile")}>
        Profile
      </div>
      <div className="menu-item logout" onClick={handleSignOut}>
        Log Out
      </div>
    </div>
  );
};

export default DriverSidebar;
