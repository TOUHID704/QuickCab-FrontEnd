import { getTokenFromCookie } from "../utils/tokenUtils"; // Importing the utility function

const BASE_URL = "http://localhost:8080/driver";

// Helper function to perform the API request
const fetchApi = async (url, method, body = null) => {
  const token = getTokenFromCookie();
  try {
    const response = await fetch(url, {
      method: method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok)
      throw new Error(`Failed to make ${method} request to ${url}`);

    const contentType = response.headers.get("content-type");
    return contentType && contentType.includes("application/json")
      ? await response.json()
      : await response.text();
  } catch (error) {
    console.error(`Error during ${method} request to ${url}:`, error);
    throw error;
  }
};

// ✅ Existing Ride APIs (Untouched)
export const getAllRideRequests = () => {
  return fetchApi(`${BASE_URL}/ride/requests`, "GET");
};

export const acceptRideRequest = (rideRequestId) => {
  return fetchApi(`${BASE_URL}/ride/${rideRequestId}/accept`, "POST");
};

export const startRide = (rideId, rideStartDto) => {
  return fetchApi(`${BASE_URL}/ride/${rideId}/start`, "POST", rideStartDto);
};

export const endRide = (rideId) => {
  return fetchApi(`${BASE_URL}/ride/${rideId}/end`, "POST");
};

export const cancelRide = (rideId) => {
  return fetchApi(`${BASE_URL}/ride/${rideId}/cancel`, "POST");
};

export const getDriverProfile = () => {
  return fetchApi(`${BASE_URL}/profile`, "GET");
};

export const rateRider = (ratingData) => {
  return fetchApi(`${BASE_URL}/rating/rider`, "POST", ratingData);
};

export const getDriverRides = (pageOffset = 0, pageSize = 10) => {
  return fetchApi(
    `${BASE_URL}/rides?pageOffset=${pageOffset}&pageSize=${pageSize}`,
    "GET"
  );
};

export const getActiveRideOfDriver = () => {
  return fetchApi(`${BASE_URL}/ride/active-ride`, "GET");
};

export const getRideHistory = (pageOffset = 0, pageSize = 10) => {
  return fetchApi(
    `${BASE_URL}/rides/history?pageOffset=${pageOffset}&pageSize=${pageSize}`,
    "GET"
  );
};

// ✅ New Wallet APIs (Same as Rider API)
export const getWalletBalance = () => {
  return fetchApi(`${BASE_URL}/wallet/getBalance`, "GET");
};

export const addWalletBalance = (amount) => {
  return fetchApi(`${BASE_URL}/wallet/addBalance/${amount}`, "PUT");
};

export const getWalletTransactionHistory = () => {
  return fetchApi(`${BASE_URL}/wallet/transactionHistory`, "GET");
};

// ✅ Export all API functions safely
export default {
  getAllRideRequests,
  acceptRideRequest,
  startRide,
  endRide,
  cancelRide,
  getDriverProfile,
  rateRider,
  getDriverRides,
  getActiveRideOfDriver,
  getRideHistory,
  getWalletBalance, // ✅ Added
  addWalletBalance, // ✅ Added
  getWalletTransactionHistory, // ✅ Added
};
