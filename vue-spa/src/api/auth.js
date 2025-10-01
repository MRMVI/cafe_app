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
  // payload = {name, email, password, password_confirmation, role}
  return handleRequest("post", "/register", payload);
}

export async function login(payload) {
  // payload = {email, password}
  const response = handleRequest("post", "/login", payload);

  const { user, token } = (await response).data;

  // save user info and token in local storage
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);

  // set token for future axios requests
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return response;
}

export async function logout() {
  return handleRequest("post", "/logout");
}
