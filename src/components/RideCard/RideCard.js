import React, { useEffect, useState } from "react";
import "../RideCard/RideCard,c";
import RideCard from "../../components/RideCard/RideCard";
import { getRideDetails } from "../../api/getMyRideApi";

const ActiveRides = () => {
  const [rides, setRides] = useState([]);
  const rideId = 1; // Hardcoded for now

  useEffect(() => {
    const fetchRideData = async () => {
      try {
        const rideData = await getRideDetails(rideId);
        console.log("Fetched Ride Data:", rideData);
        if (rideData) {
          setRides([rideData]);
        }
      } catch (error) {
        console.error("Failed to fetch ride data:", error);
      }
    };

    fetchRideData();
  }, []);

  return (
    <div className="active-rides-container">
      {rides.length > 0 ? (
        rides.map((ride, index) => <RideCard key={index} ride={ride} />)
      ) : (
        <div className="loading-container">Loading rides...</div>
      )}
    </div>
  );
};

export default ActiveRides;
