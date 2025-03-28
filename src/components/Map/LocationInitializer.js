import { useEffect } from "react";
import { useMap } from "react-leaflet";

const LocationInitializer = ({ onLocationFound }) => {
  const map = useMap();

  useEffect(() => {
    const locationFoundHandler = (e) => {
      map.flyTo(e.latlng, map.getZoom());
      onLocationFound([e.latlng.lng, e.latlng.lat]);
    };

    const locationErrorHandler = (e) => {
      console.error("Location access denied:", e.message);
      // Default to city center if location access is denied
      const defaultLocation = [72.8777, 19.076]; // Mumbai coordinates [lng, lat]
      onLocationFound(defaultLocation);
    };

    map.locate({ setView: true, maxZoom: 16 });
    map.on("locationfound", locationFoundHandler);
    map.on("locationerror", locationErrorHandler);

    return () => {
      map.off("locationfound", locationFoundHandler);
      map.off("locationerror", locationErrorHandler);
    };
  }, [map, onLocationFound]);

  return null;
};

export default LocationInitializer;
