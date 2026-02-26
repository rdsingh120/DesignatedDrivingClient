import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 20000,
});

// Attach JWT automatically (Option A: localStorage)
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // backend returns "token"
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors: backend sometimes returns {message}, sometimes {error}
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status ?? null;
    const data = error?.response?.data ?? null;

    const message =
      data?.message ||
      data?.error ||
      error?.message ||
      "Request failed";

    return Promise.reject({ status, message, data });
  }
);