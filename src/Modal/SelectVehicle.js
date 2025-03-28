import React, { useState, useEffect } from "react";
import "./SelectVehicle.css";
import { cancelRideRequest } from "../api/riderApi";

const vehicles = [
  { id: 1, name: "Standard Car", emoji: "🚗" },
  { id: 2, name: "Luxury Car", emoji: "🚙" },
  { id: 3, name: "SUV", emoji: "🚘" },
];

const SelectVehicle = ({ rideDetails, onProceed, onClose }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  console.log("🚖 Ride Details:", rideDetails); // Debugging log

  const estimatedFare = rideDetails?.fare ?? 0;
  const formattedFare = Number(estimatedFare).toFixed(2);
  const rideRequestId = rideDetails?.rideRequestId; // ✅ Get rideRequestId

  const handleCancelRide = async () => {
    if (!rideRequestId) {
      console.error("❌ No rideRequestId found. Cannot cancel ride.");
      return;
    }

    try {
      await cancelRideRequest(rideRequestId);
      console.log("✅ Ride request canceled successfully.");
    } catch (error) {
      console.error("❌ Error canceling ride request:", error);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="select-vehicle-modal">
        <span className="vehicle-emoji">🚖</span>
        <h2>Select Your Vehicle</h2>
        <p>Choose the best ride for you.</p>

        <div className="vehicle-options">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`vehicle-option ${
                selectedVehicle === vehicle.id ? "selected" : ""
              }`}
              onClick={() => setSelectedVehicle(vehicle.id)}
            >
              <span className="vehicle-icon">{vehicle.emoji}</span>
              <p>{vehicle.name}</p>
              <p className="fare-info">
                Fare: <span>₹{formattedFare}</span>
              </p>
            </div>
          ))}
        </div>

        {selectedVehicle && (
          <button
            className="proceed-button"
            onClick={() => onProceed(selectedVehicle)}
          >
            Proceed
          </button>
        )}

        <button className="cancel-button" onClick={handleCancelRide}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SelectVehicle;
