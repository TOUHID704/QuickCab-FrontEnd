import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Use Routes instead of Switch
import UserProfile from "./pages/Rider/UserProfilePage/UserProfile";
import RiderDashBoard from "./pages/Rider/RiderDashBoard/RiderDashBoard";
import BookingRide from "./pages/Rider/BookingRide/BookingRide";
import "leaflet/dist/leaflet.css"; // Leaflet CSS for styling

// Import Leaflet and configure marker icons
import L from "leaflet";
import HomePage from "./pages/Home/HomePage";
import DriverRideRequests from "./pages/Driver/DriverRideRequests/DriverRideRequests";
import DriverProfile from "./pages/Driver/DriverProfile/DriverProfile";
import DriverWallet from "./pages/Driver/DriverWallet/DriverWallet";
import DriverDashboard from "./pages/Driver/DriverDashboard/DriverDashboard";
import DriverActiveRides from "./pages/Driver/DriverActiveRides/DriverActiveRides";
import RideDashboard from "./pages/Rider/RideDashboard/RideDashBoard";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import RiderWallet from "./pages/Rider/RiderWallet/RiderWallet";
import DriverRideHistory from "./pages/Driver/DriverRideHistory/DriverRideHistory";

// Fix Leaflet marker icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/riderdashboard" element={<RiderDashBoard />} />
        <Route path="/bookingRide" element={<BookingRide />} />
        <Route path="/ridePage" element={<RideDashboard />} />
        <Route path="/driverdashboard" element={<DriverDashboard />} />
        <Route path="/driverRideRequests" element={<DriverRideRequests />} />
        <Route path="/driverProfile" element={<DriverProfile />} />
        <Route path="/wallet" element={<DriverWallet />} />
        <Route path="/driverActiveRides" element={<DriverActiveRides />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/activeRide" element={<DriverActiveRides />} />
        <Route path="/riderWallet" element={<RiderWallet />} />
        <Route path="/driverRideHistory" element={<DriverRideHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
