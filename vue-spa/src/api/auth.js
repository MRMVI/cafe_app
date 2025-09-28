import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Your Laravel API URL
  headers: {
    // prettier-ignore
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// Reusable handle request
async function handleRequest(method, url, data = null) {
  try {
    const response = await api.request({ method, url, data });

    return response;
  } catch (err) {
    throw err.response?.data || { message: "Something went wrong!" };
  }
}

// Register a user
export function register(payload) {
  // payload = {name, email, password, password_confirmation, role}
  return handleRequest("post", "/register", payload);
}

export async function login(payload) {
  // payload = {email, password}
  return handleRequest("post", "/login", payload);
}

export async function logout() {
  return handleRequest("post", "/logout");
}
