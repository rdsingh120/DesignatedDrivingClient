// src/api/driverClient.js
import { http } from "./http";

export const apiGetMyDriverProfile = () => http.get("/api/driver-profiles/me");
export const apiUpdateMyDriverStatus = (payload) =>
  http.patch("/api/driver-profiles/me/status", payload);
export const apiCreateMyDriverProfile = () => http.post("/api/driver-profiles/me");
export const apiUpdateMyDriverProfile = (payload) => http.patch("/api/driver-profiles/me", payload);