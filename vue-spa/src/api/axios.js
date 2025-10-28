import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // very important
  headers: {
    // prettier-ignore
    "Accept": "application/json",
  },
});

// Load token from LocalStorage on startup (if user is already logged in)
// Interceptor: attach token dynamically for every request
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export default api;
