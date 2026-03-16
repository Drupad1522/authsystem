import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => API.post("/auth/login", data);
export const signup = (data) => API.post("/auth/signup", data);
export const verifyOtp = (data) => API.post("/auth/verify-otp", data);
export const resendOtp = (data) => API.post("/auth/resend-otp", data);
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const resetPasswordVerifyOtp = (data) => API.post("/auth/reset-password/verify-otp", data);

export default API;