import { MapContainer, TileLayer, Marker } from "react-leaflet";
import LocationInitializer from "./LocationInitializer";
import LocationPicker from "./LocationPicker";
import { reverseGeocode } from "../../api/locationApi";
import "./RideMap.css";

const RideMap = ({
  currentLocation,
  setCurrentLocation,
  pickupLocation,
  setPickupLocation,
  dropLocation,
  setDropLocation,
  setPickupAddress,
  setDropAddress,
}) => {
  return (
    <div className="map-container">
      <MapContainer center={[19.076, 72.8777]} zoom={13} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationInitializer onLocationFound={setCurrentLocation} />
        <LocationPicker
          onLocationSelect={(coords) => {
            if (!pickupLocation) {
              setPickupLocation(coords);
              reverseGeocode(coords[1], coords[0]).then(setPickupAddress);
            } else if (!dropLocation) {
              setDropLocation(coords);
              reverseGeocode(coords[1], coords[0]).then(setDropAddress);
            }
          }}
        />
        {currentLocation && (
          <Marker position={[currentLocation[1], currentLocation[0]]} />
        )}
        {pickupLocation && (
          <Marker position={[pickupLocation[1], pickupLocation[0]]} />
        )}
        {dropLocation && (
          <Marker position={[dropLocation[1], dropLocation[0]]} />
        )}
      </MapContainer>
    </div>
  );
};

export default RideMap;
