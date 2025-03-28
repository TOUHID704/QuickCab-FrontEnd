import React from "react";
import { useNavigate } from "react-router-dom";
import DriverNavBar from "../DriverNavBar/DriverNavBar";
import "./DriverDashboard.css"; // Import the new CSS file
import DriverSidebar from "../DriverSideBar/DriverSidebar";

const DriverDashboard = () => {
  return (
    <div className="dashboard">
      <DriverSidebar />
      <div className="main-content">
        <DriverNavBar />

        {/* Professional Welcome Card */}
        <div className="card">
          <h3>Welcome to Your Driver Dashboard</h3>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
