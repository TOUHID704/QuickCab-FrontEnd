export const searchLocations = async (query) => {
  if (!query || query.length < 2) return [];

  try {
    // Add a small delay to prevent hitting rate limits
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return data.map((item) => ({
      label: item.display_name,
      value: [parseFloat(item.lon), parseFloat(item.lat)],
    }));
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return "";
  }
};
