import React, { useState } from "react";
import "./AdminDashboard.css";
import { onBoardNewDriverApi } from "../../../api/authApi"; // API function

const AdminDashboard = () => {
  const [driverId, setDriverId] = useState(""); // Driver ID state
  const [vehicleId, setVehicleId] = useState(""); // Vehicle ID state
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [message, setMessage] = useState(""); // Message for success or error

  // Function to handle onboarding a new driver
  const handleOnboardDriver = async () => {
    if (!driverId.trim() || !vehicleId.trim()) {
      setMessage("Please enter both Driver ID and Vehicle ID.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Ensure vehicleId is passed as a string
      const requestData = { vehicleId: String(vehicleId) };

      // Debugging: Log the request payload
      console.log("Request Data Sent to API:", JSON.stringify(requestData));

      // Sending request to API
      const response = await onBoardNewDriverApi(driverId, vehicleId);

      // Debugging: Log the full API response
      console.log("API Response:", response);

      // Ensure the response contains the expected `data` field
      if (response?.data?.driverId) {
        setMessage(`Driver ${response.data.driverId} onboarded successfully!`);
      } else {
        setMessage("Failed to onboard driver. Please check input values.");
      }
    } catch (error) {
      console.error("Error onboarding driver:", error);
      setMessage(`Error: ${error.message || "Onboarding failed. Try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="onboard-section">
        <h3>Onboard New Driver</h3>

        {/* Input for Driver ID */}
        <input
          type="text"
          placeholder="Enter Driver ID"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
        />

        {/* Input for Vehicle ID */}
        <input
          type="text"
          placeholder="Enter Vehicle Number"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
        />

        {/* Button to trigger onboarding API */}
        <button onClick={handleOnboardDriver} disabled={loading}>
          {loading ? "Onboarding..." : "Onboard Driver"}
        </button>

        {/* Display success or error messages */}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
