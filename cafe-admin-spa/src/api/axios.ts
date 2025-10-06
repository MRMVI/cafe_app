import axios from "axios";
import type { AxiosInstance } from "axios";


const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api", 
    headers: {
        "Accept": "application/json"
    }
});

// Interceptor: attach token dynamically for every request
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log("Auth header attached: ", config.headers.Authorization);
    } else {
        console.log("No token found in localStorage");
        delete config.headers.Authorization;
    }

    return config;
});

// optional: response interceptor to auto-refresh token on 401
// api.interceptors.response.use(
//     response => response,
//     async error => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 await refreshAccessToken(); // refresh token
//                 return api(originalRequest); // retry original request
//             } catch {
//                 localStorage.removeItem("access_token");
//                 localStorage.removeItem("refresh_token");
//                 router.push("/login");
//                 return Promise.reject(error);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default api;