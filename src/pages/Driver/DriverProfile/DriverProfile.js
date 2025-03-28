import React, { useEffect, useState } from "react";
import { getDriverProfile } from "../../../api/driverApi";

const DriverProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDriverProfile();
        setUserProfile(data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!userProfile || !userProfile.data || !userProfile.data.user) {
    return <div className="error">Error: User data not available</div>;
  }

  const { name, email, roles } = userProfile.data.user;
  const { rating, driverId } = userProfile.data; // ✅ Corrected from riderId to driverId

  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>
      <div className="profile-details">
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Roles:</strong> {roles.join(", ")}
        </p>
        <p>
          <strong>Driver ID:</strong> {driverId} {/* ✅ Fixed */}
        </p>
        <p>
          <strong>Rating:</strong> {rating}
        </p>
      </div>
    </div>
  );
};

export default DriverProfile;
