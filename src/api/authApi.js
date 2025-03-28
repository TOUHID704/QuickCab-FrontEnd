import { getTokenFromCookie } from "../utils/tokenUtils"; // Import function to get token

const BASE_URL = "http://localhost:8080/auth";

// ✅ Reusable Fetch API Function
const fetchApi = async (url, method, body = null) => {
  const token = getTokenFromCookie(); // Fetch token from cookies
  console.log("Token fetched from cookie:", token || "No token available"); // Debugging log

  const headers = {};
  if (body) {
    headers["Content-Type"] = "application/json"; // Only add when body exists
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      credentials: "include", // Ensures cookies are sent
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Read response as text
      console.error(`${method} request failed:`, response.status, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    // ✅ Handle JSON, plain text, and empty responses
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return await response.json(); // Parse JSON if applicable
    } else if (contentType) {
      return await response.text(); // Read as plain text otherwise
    }
    return null; // Handle empty responses
  } catch (error) {
    console.error(`Error during ${method} request to ${url}:`, error);
    throw error;
  }
};

// ✅ Login API
export const loginApi = async (loginData) => {
  return fetchApi(`${BASE_URL}/login`, "POST", loginData);
};

// ✅ Logout API (No Token Required)
export const logOutApi = async () => {
  return fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include", // Ensures the cookie is sent
    headers: { "Content-Type": "application/json" },
  }).then((response) =>
    response.ok ? response.text() : Promise.reject("Logout failed")
  );
};

// ✅ Fetch Roles API
export const roleApi = async (email) => {
  return fetchApi(
    `${BASE_URL}/roles?email=${encodeURIComponent(email)}`,
    "GET"
  );
};

// ✅ SignUp API
export const signUpApi = async (formData) => {
  return fetchApi(`${BASE_URL}/signUp`, "POST", formData);
};

// ✅ Refresh Token API
export const refreshApi = async () => {
  return fetchApi(`${BASE_URL}/refresh`, "POST");
};

// ✅ **Onboard New Driver API (Handles token properly)**
export const onBoardNewDriverApi = async (driverId, vehicleId) => {
  return fetchApi(
    `${BASE_URL}/onBoardNewDriver/${encodeURIComponent(driverId)}`,
    "POST",
    {
      vehicleId: vehicleId ? String(vehicleId) : null, // Ensure vehicleId is passed correctly
    }
  );
};
