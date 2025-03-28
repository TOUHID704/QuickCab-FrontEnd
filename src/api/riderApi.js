import { getTokenFromCookie } from "../../src/utils/tokenUtils";

const BASE_URL = "http://localhost:8080/rider";

// Helper function to perform API requests
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

    // Check if response has JSON data
    const contentType = response.headers.get("content-type");
    return contentType && contentType.includes("application/json")
      ? await response.json()
      : await response.text(); // Handle text responses
  } catch (error) {
    console.error(`Error during ${method} request to ${url}:`, error);
    throw error;
  }
};

// ✅ Existing Ride APIs (Untouched)
export const requestRide = (rideRequestData) => {
  return fetchApi(`${BASE_URL}/ride/request`, "POST", rideRequestData);
};

export const cancelRideRequest = (rideRequestId) => {
  return fetchApi(`${BASE_URL}/ride/cancel-request/${rideRequestId}`, "DELETE");
};

export const rateDriver = (ratingData) => {
  return fetchApi(`${BASE_URL}/driver/rate`, "POST", ratingData);
};

export const getRiderProfile = () => {
  return fetchApi(`${BASE_URL}/profile`, "GET");
};

export const getAllRidesForRider = (riderId, page = 0, size = 10) => {
  return fetchApi(
    `${BASE_URL}/rides?riderId=${riderId}&page=${page}&size=${size}`,
    "GET"
  );
};

export const getRideRequestStatus = (rideRequestId) => {
  return fetchApi(`${BASE_URL}/ride/${rideRequestId}/status`, "GET");
};

export const getRideDetails = (rideId) => {
  return fetchApi(`${BASE_URL}/ride/${rideId}`, "GET");
};

export const getRideHistory = (pageOffset = 0, pageSize = 10) => {
  return fetchApi(
    `${BASE_URL}/rides/history?pageOffset=${pageOffset}&pageSize=${pageSize}`,
    "GET"
  );
};

export const getActiveRides = (pageOffset = 0, pageSize = 10) => {
  return fetchApi(
    `${BASE_URL}/rides/active-rides?pageOffset=${pageOffset}&pageSize=${pageSize}`,
    "GET"
  );
};

// ✅ New Wallet APIs (Integrated Without Breaking Existing Code)
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
  requestRide,
  cancelRideRequest,
  rateDriver,
  getRiderProfile,
  getAllRidesForRider,
  getRideRequestStatus,
  getRideDetails,
  getRideHistory,
  getActiveRides,
  getWalletBalance, // ✅ Added
  addWalletBalance, // ✅ Added
  getWalletTransactionHistory, // ✅ Added
};
