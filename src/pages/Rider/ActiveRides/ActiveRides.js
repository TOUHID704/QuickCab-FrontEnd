import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for redirection
import { getActiveRides } from "../../../api/riderApi"; // Import API function
import "../ActiveRides/ActiveRide.css";

const ActiveRides = () => {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await getActiveRides(); // Fetch active rides
        const activeRides = response.data.content || [];

        // If all rides are ended, redirect to history
        if (
          activeRides.length > 0 &&
          activeRides.every((ride) => ride.rideStatus === "ENDED")
        ) {
          navigate("/ride-history");
          return;
        }

        setRides(activeRides);
      } catch (error) {
        console.error("Error fetching active rides:", error);
      }
    };

    fetchRides();
    const interval = setInterval(fetchRides, 5000); // Poll API every 5 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  if (rides.length === 0)
    return <div className="loading">🚗 No active rides found</div>;

  return (
    <div className="active-rides">
      <h2>🚖 Active Rides</h2>
      {rides.map((ride) => (
        <div
          key={ride.rideId}
          className={`ride-card ${ride.rideStatus.toLowerCase()}`}
        >
          <p>
            <strong>📍 Pickup:</strong>{" "}
            {ride.pickupLocation?.coordinates.join(", ")}
          </p>
          <p>
            <strong>🏁 Drop-off:</strong>{" "}
            {ride.dropOffLocation?.coordinates.join(", ")}
          </p>
          <p>
            <strong>💰 Fare:</strong>{" "}
            {ride.fare ? `$${ride.fare.toFixed(2)}` : "N/A"}
          </p>
          <p>
            <strong>📜 Status:</strong>{" "}
            <span className="status">
              {getStatusEmoji(ride.rideStatus)} {ride.rideStatus}
            </span>
          </p>
          <p>
            <strong>💳 Payment:</strong> {ride.paymentMethod}
          </p>
          <p>
            <strong>🔢 OTP:</strong>{" "}
            <span className="otp">{ride.otp || "N/A"}</span>
          </p>
          <p>
            <strong>⏳ Requested At:</strong>{" "}
            {new Date(ride.createdTime).toLocaleString()}
          </p>

          {ride.driver && ride.driver.user ? (
            <div className="driver-info">
              <p>
                <strong>👨‍✈️ Driver:</strong> {ride.driver.user.name}
              </p>
              <p>
                <strong>⭐ Driver Rating:</strong>{" "}
                {ride.driver.rating !== undefined ? ride.driver.rating : "N/A"}
              </p>
            </div>
          ) : (
            <p>
              <strong>🚘 Driver:</strong> Not assigned yet
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

// Helper function to add status emojis
const getStatusEmoji = (status) => {
  switch (status) {
    case "CONFIRMED":
      return "✅";
    case "ONGOING":
      return "🚦";
    case "ACCEPTED":
      return "🛠";
    case "CANCELLED":
      return "❌";
    case "ENDED":
      return "🏁";
    default:
      return "ℹ️";
  }
};

export default ActiveRides;
