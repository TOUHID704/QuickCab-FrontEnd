import React, { useState, useEffect } from "react";
import "./BookingRide.css";
import { useNavigate } from "react-router-dom";
import { getTokenFromCookie } from "../../../utils/tokenUtils";
import { requestRide, getRideRequestStatus } from "../../../api/riderApi";
import { reverseGeocode } from "../../../api/locationApi";
import RideMap from "../../../components/Map/RideMap";
import FindDriverModal from "../../../Modal/FindDriverModal";
import SelectVehicle from "../../../Modal/SelectVehicle";

// Fetch location suggestions from OpenStreetMap
const fetchLocationSuggestions = async (query) => {
  if (query.length < 2) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await response.json();

    return data.slice(0, 5).map((place) => ({
      name: place.display_name,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    }));
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    return [];
  }
};

const BookingRide = () => {
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("WALLET");
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isSelectingVehicle, setIsSelectingVehicle] = useState(false);
  const [isFindingDriver, setIsFindingDriver] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Location Suggestions
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [isDropFocused, setIsDropFocused] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Prevent scrolling when modals are open
  useEffect(() => {
    if (isSelectingVehicle || isFindingDriver) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [isSelectingVehicle, isFindingDriver]);

  // Fetch suggestions dynamically with debounce
  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      if (pickupAddress.length >= 2 && !pickupLocation) {
        setPickupSuggestions(await fetchLocationSuggestions(pickupAddress));
      } else {
        setPickupSuggestions([]);
      }

      if (dropAddress.length >= 2 && !dropLocation) {
        setDropSuggestions(await fetchLocationSuggestions(dropAddress));
      } else {
        setDropSuggestions([]);
      }
    }, 500);

    setTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [pickupAddress, dropAddress, pickupLocation, dropLocation]);

  // Handle selecting a pickup suggestion
  const handleSelectPickupSuggestion = (suggestion) => {
    setPickupAddress(suggestion.name);
    setPickupLocation([suggestion.lon, suggestion.lat]);
    setPickupSuggestions([]); // Clear suggestions
  };

  // Handle selecting a drop suggestion
  const handleSelectDropSuggestion = (suggestion) => {
    setDropAddress(suggestion.name);
    setDropLocation([suggestion.lon, suggestion.lat]);
    setDropSuggestions([]); // Clear suggestions
  };

  // Handle ride request
  const handleRequestRide = async () => {
    if (!pickupLocation || !dropLocation) {
      alert("Please select both pickup and drop locations");
      return;
    }

    const token = getTokenFromCookie();
    if (!token) {
      alert("No token found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await requestRide({
        pickupLocation: { coordinates: pickupLocation },
        dropOffLocation: { coordinates: dropLocation },
        paymentMethod,
      });

      if (response?.data) {
        setRideDetails({
          rideRequestId: response.data.rideRequestId,
          pickupAddress,
          dropAddress,
          paymentMethod,
          fare: response.data.fare,
        });
        setIsSelectingVehicle(true);
      } else {
        alert("Failed to request ride");
      }
    } catch (error) {
      console.error("Error requesting ride:", error);
      alert("Error requesting ride");
    } finally {
      setLoading(false);
    }
  };

  // Handle proceeding with vehicle selection
  const handleProceedWithVehicle = async (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsSelectingVehicle(false);
    setIsFindingDriver(true);

    if (!rideDetails?.rideRequestId) {
      console.error("🚨 Missing rideRequestId! Cannot proceed.");
      setIsFindingDriver(false);
      return;
    }

    let polling = true;
    while (polling) {
      try {
        const rideResponse = await getRideRequestStatus(
          rideDetails.rideRequestId
        );
        if (rideResponse?.data) {
          console.log("✅ Driver Found:", rideResponse.data);
          polling = false;
          setIsFindingDriver(false);
          navigate("/ridePage");
        } else {
          console.log("🔄 Waiting for driver to accept...");
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.error("❌ Error checking ride status:", error);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  };

  return (
    <div className="booking-container">
      {isSelectingVehicle && (
        <SelectVehicle
          rideDetails={rideDetails}
          onClose={() => setIsSelectingVehicle(false)}
          onProceed={handleProceedWithVehicle}
        />
      )}
      {isFindingDriver && (
        <FindDriverModal onCancel={() => setIsFindingDriver(false)} />
      )}

      <div className="booking-form">
        <h2>Book a Ride</h2>

        {/* Pickup Location Input */}
        <div className="form-group">
          <label>Pickup Location</label>
          <input
            type="text"
            value={pickupAddress}
            onChange={(e) => {
              setPickupAddress(e.target.value);
              if (e.target.value === "") {
                setPickupLocation(null); // Reset location state
              }
            }}
            placeholder="Enter pickup location"
          />
          {pickupSuggestions.length > 0 && (
            <ul className="suggestions-container">
              {pickupSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSelectPickupSuggestion(suggestion)}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drop Location Input */}
        <div className="form-group">
          <label>Drop Location</label>
          <input
            type="text"
            value={dropAddress}
            onChange={(e) => {
              setDropAddress(e.target.value);
              if (e.target.value === "") {
                setDropLocation(null); // Reset location state
              }
            }}
            placeholder="Enter drop location"
          />
          {dropSuggestions.length > 0 && (
            <ul className="suggestions-container">
              {dropSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSelectDropSuggestion(suggestion)}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="WALLET">Wallet</option>
            <option value="CARD">Card</option>
            <option value="CASH">Cash</option>
          </select>
        </div>

        <button
          className="request-button"
          onClick={handleRequestRide}
          disabled={loading}
        >
          {loading ? "Requesting..." : "Request Ride"}
        </button>
      </div>

      <RideMap
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        pickupLocation={pickupLocation}
        setPickupLocation={setPickupLocation}
        dropLocation={dropLocation}
        setDropLocation={setDropLocation}
        setPickupAddress={setPickupAddress}
        setDropAddress={setDropAddress}
      />
    </div>
  );
};

export default BookingRide;
