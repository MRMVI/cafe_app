import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    // prettier-ignore
    "Accept": "application/json",
  },
});

// Load token from LocalStorage on startup (if user is already logged in)
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
