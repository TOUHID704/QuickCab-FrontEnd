import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllRideRequests,
  acceptRideRequest,
  cancelRide,
} from "../../../api/driverApi";
import "../DriverRideRequests/DriverRideRequests.css"; // Import CSS

const DriverRideRequests = () => {
  const [rideRequests, setRideRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    const fetchRides = async () => {
      try {
        const response = await getAllRideRequests();
        const requests = response.data || [];
        setRideRequests(requests);

        // Adjust polling frequency based on ride requests availability
        const pollingRate = requests.length > 0 ? 5000 : 15000;
        clearInterval(intervalId);
        intervalId = setInterval(fetchRides, pollingRate);
      } catch (error) {
        console.error("Error fetching ride requests:", error);
      }
    };

    fetchRides(); // Initial fetch
    intervalId = setInterval(fetchRides, 10000); // Default polling every 10s

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []); // Empty dependency array ensures it runs once

  const handleAccept = async (rideRequestId) => {
    try {
      const response = await acceptRideRequest(rideRequestId);
      if (response.data && response.data.rideId) {
        const rideId = response.data.rideId;
        alert(`Ride ${rideId} accepted successfully!`);
        navigate(`/driverActiveRides`, { state: { rideId } });
      } else {
        alert("Failed to retrieve ride ID.");
      }
    } catch (error) {
      console.error("Error accepting ride:", error);
      alert("Failed to accept the ride.");
    }
  };

  const handleReject = async (rideRequestId) => {
    try {
      await cancelRide(rideRequestId);
      alert(`Ride ${rideRequestId} rejected successfully!`);
      setRideRequests((prevRequests) =>
        prevRequests.filter((ride) => ride.rideRequestId !== rideRequestId)
      );
    } catch (error) {
      console.error("Error rejecting ride:", error);
      alert("Failed to reject the ride.");
    }
  };

  return (
    <div className="driver-ride-requests">
      <h1>Ride Requests</h1>
      {rideRequests.length === 0 ? (
        <p className="no-requests">No ride requests available.</p>
      ) : (
        <div className="ride-requests-grid">
          {rideRequests.map((ride) => (
            <div key={ride.rideRequestId} className="ride-request-card">
              <div className="ride-header">
                <h2>Ride #{ride.rideRequestId}</h2>
                <span className="ride-status">{ride.rideRequestStatus}</span>
              </div>
              <p>
                <strong>Pickup:</strong>{" "}
                {ride.pickupLocation.coordinates.join(", ")}
              </p>
              <p>
                <strong>Drop-off:</strong>{" "}
                {ride.dropOffLocation.coordinates.join(", ")}
              </p>
              <p>
                <strong>Fare:</strong> ${ride.fare.toFixed(2)}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(ride.rideRequestedTime).toLocaleString()}
              </p>
              <p>
                <strong>Rider:</strong> {ride.rider.user.name}
              </p>
              <p>
                <strong>Payment:</strong> {ride.paymentMethod}
              </p>
              <div className="ride-actions">
                <button
                  className="accept-btn"
                  onClick={() => handleAccept(ride.rideRequestId)}
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleReject(ride.rideRequestId)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverRideRequests;
