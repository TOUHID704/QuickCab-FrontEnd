import React, { useEffect, useState } from "react";
import { getRideHistory } from "../../../api/driverApi";

const DriverRideHistory = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const response = await getRideHistory();
        if (response && response.data) {
          setRides(response.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch ride history:", error);
      }
    };

    fetchRideHistory();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      ENDED: { text: "✅ Completed", className: "status-completed" },
      CANCELLED: { text: "❌ Cancelled", className: "status-cancelled" },
      PENDING: { text: "⏳ Pending", className: "status-pending" },
      ONGOING: { text: "🚖 In Progress", className: "status-ongoing" },
    };
    return (
      statusMap[status] || { text: "🔘 Unknown", className: "status-unknown" }
    );
  };

  return (
    <div className="history-rides-container">
      <h2>📜 Ride History</h2>
      <div className="ride-cards-grid">
        {rides.length > 0 ? (
          rides.map((ride) => {
            const status = getStatusBadge(ride.rideStatus);
            return (
              <div key={ride.rideId} className="ride-history-card">
                <div className="ride-header">
                  <h3>🚖 Ride #{ride.rideId}</h3>
                  <span className={`status-badge ${status.className}`}>
                    {status.text}
                  </span>
                </div>
                <p>
                  📍 <strong>Pickup:</strong>{" "}
                  {ride.pickupLocation?.coordinates.join(", ")}
                </p>
                <p>
                  🎯 <strong>Drop-off:</strong>{" "}
                  {ride.dropOffLocation?.coordinates.join(", ")}
                </p>
                <p>
                  💰 <strong>Fare:</strong> ${ride.fare.toFixed(2)}
                </p>
                <p>
                  ⏳ <strong>Duration:</strong>{" "}
                  {ride.endedAt && ride.startedAt
                    ? Math.round(
                        (new Date(ride.endedAt) - new Date(ride.startedAt)) /
                          60000
                      ) + " minutes"
                    : "N/A"}
                </p>
                <p>
                  🚗 <strong>Vehicle ID:</strong>{" "}
                  {ride.driver?.vehicleId || "N/A"}
                </p>
                <p>
                  👨‍✈️ <strong>Driver:</strong> {ride.driver?.user?.name || "N/A"}{" "}
                  | ⭐ {ride.driver?.rating?.toFixed(1) || "N/A"}
                </p>
                <p>
                  🙍‍♂️ <strong>Rider:</strong> {ride.rider?.user?.name || "N/A"} |
                  ⭐ {ride.rider?.rating?.toFixed(1) || "N/A"}
                </p>
                <p>
                  💳 <strong>Payment:</strong> {ride.paymentMethod || "N/A"}
                </p>
                <p>
                  📅 <strong>Date:</strong>{" "}
                  {new Date(ride.createdTime).toLocaleDateString()}
                </p>
                <p>
                  🕒 <strong>Start Time:</strong>{" "}
                  {new Date(ride.startedAt).toLocaleTimeString()}
                </p>
                <p>
                  ⏲ <strong>End Time:</strong>{" "}
                  {new Date(ride.endedAt).toLocaleTimeString()}
                </p>
              </div>
            );
          })
        ) : (
          <p className="no-rides">No past rides found. 🚘</p>
        )}
      </div>
    </div>
  );
};

export default DriverRideHistory;
