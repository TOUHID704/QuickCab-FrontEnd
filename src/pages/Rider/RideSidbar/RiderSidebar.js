// RiderSidebar.js
import React from "react";
import "./RiderSidebar.css";

const RiderSidebar = ({ setActiveTab, activeTab }) => {
  return (
    <div className="rider-sidebar">
      <h2>Rides</h2>
      <ul>
        <li
          className={activeTab === "active" ? "active" : ""}
          onClick={() => setActiveTab("active")}
        >
          Active Rides
        </li>
        <li
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Ride History
        </li>
      </ul>
    </div>
  );
};

export default RiderSidebar;
