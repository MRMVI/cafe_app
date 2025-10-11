import axios from "axios";
import api from "../axios";
import type { AxiosResponse } from "axios";
// register, login, logout, password reset/change

import type {
  RegisterValues,
  RegisterResponse,
  LoginValues,
  LoginResponse,
  LogoutResponse,
} from "../../types/index";

// request helper
async function hanldeRequest<T>(
  method: "POST",
  url: string,
  data?: any
): Promise<AxiosResponse<T>> {
  try {
    const response = await api.request<T>({ method, url, data });

    // axios response
    return response;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err;
    }

    console.error(err);
    throw new Error("Unexpected error");
  }
}

export function register(
  payload: RegisterValues
): Promise<AxiosResponse<RegisterResponse>> {
  // payload = {name, email, password, password_confirmation, role}
  payload = { ...payload, role: "admin" };
  return hanldeRequest<RegisterResponse>("POST", "/register", payload);
}

export async function login(
  payload: LoginValues
): Promise<AxiosResponse<LoginResponse>> {
  return hanldeRequest<LoginResponse>("POST", "/login", payload);
}

export function logout(): Promise<AxiosResponse<LogoutResponse>> {
  return hanldeRequest<LogoutResponse>("POST", "/logout", null);
}

export function resetPassword() {}

export async function refreshAccessToken() : Promise<void> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token, please login again");

    const response = await hanldeRequest<{access_token: string}>("POST", "/refresh", {refresh_token: refreshToken});

    localStorage.setItem("access_token", response.data.access_token);
}
