import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  getActiveRideOfDriver,
  startRide,
  endRide,
} from "../../../api/driverApi";
import "../DriverActiveRides/DriverActiveRides.css"; // Import CSS

const DriverActiveRides = () => {
  const [rideId, setRideId] = useState(null);
  const [otp, setOtp] = useState("");
  const [rideStarted, setRideStarted] = useState(false);
  const navigate = useNavigate(); // Navigation hook

  // Fetch active ride status
  const fetchActiveRide = async () => {
    try {
      const response = await getActiveRideOfDriver();
      if (response.data && response.data.rideId) {
        setRideId(response.data.rideId);

        // Check if the ride is already ONGOING
        if (response.data.rideStatus === "ONGOING") {
          setRideStarted(true);
        }
      } else {
        console.warn("No active ride found.");
      }
    } catch (error) {
      console.error("Error fetching active ride:", error);
    }
  };

  useEffect(() => {
    fetchActiveRide();
  }, []);

  const handleStartRide = async () => {
    if (!otp) {
      alert("Please enter the OTP before starting the ride.");
      return;
    }

    try {
      await startRide(rideId, { otp });
      alert("✅ Ride started successfully!");
      fetchActiveRide(); // Fetch the latest status after starting the ride
    } catch (error) {
      console.error("Error starting the ride:", error);
      alert("❌ Failed to start the ride. Please check the OTP and try again.");
    }
  };

  const handleEndRide = async () => {
    try {
      await endRide(rideId);
      alert("🚗 Ride ended successfully!");
      setRideStarted(false);

      // Redirect to Driver Dashboard after ending the ride
      navigate("/driverdashboard");
    } catch (error) {
      console.error("Error ending the ride:", error);
      alert("❌ Failed to end the ride.");
    }
  };

  return (
    <div className="active-ride-container">
      <h2>🚖 Active Ride</h2>
      {rideId ? (
        <div className="ride-card">
          <p>
            <strong>🆔 Ride ID:</strong> {rideId}
          </p>
          {!rideStarted ? (
            <div className="otp-section">
              <input
                type="text"
                placeholder="🔢 Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="otp-input"
              />
              <button className="start-btn" onClick={handleStartRide}>
                ▶️ Start Ride
              </button>
            </div>
          ) : (
            <button className="end-btn" onClick={handleEndRide}>
              ⛔ End Ride
            </button>
          )}
        </div>
      ) : (
        <p>❌ No active ride found.</p>
      )}
    </div>
  );
};

export default DriverActiveRides;
