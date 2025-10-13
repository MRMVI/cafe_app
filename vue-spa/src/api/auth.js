import api from "./axios";

// Reusable handle request
async function handleRequest(method, url, data = null) {
  try {
    const response = await api.request({ method, url, data });

    return response;
  } catch (err) {
    throw err;
  }
}

// Register a user
export function register(payload) {
  // payload = {name, email, password, password_confirmation}
  payload = { ...payload, role: "user" };
  return handleRequest("post", "/register", payload);
}

export async function login(payload) {
  // payload = {email, password}
  return handleRequest("post", "/login", payload);
}

export async function logout() {
  return handleRequest("post", "/logout");
}
