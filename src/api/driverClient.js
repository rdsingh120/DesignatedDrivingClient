// src/api/driverClient.js
import { http } from "./http";

export const apiGetMyDriverProfile = () => http.get("/api/driver-profiles/me");
export const apiUpdateMyDriverStatus = (payload) =>
  http.patch("/api/driver-profiles/me/status", payload);
export const apiCreateMyDriverProfile = () => http.post("/api/driver-profiles/me");
export const apiUpdateMyDriverProfile = (payload) => http.patch("/api/driver-profiles/me", payload);

export const apiUploadDriverPhoto = (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  return http.post("/api/driver-profiles/me/photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export async function updateDriverLocation(lat, lng) {
  const res = await http.post("/api/drivers/location", {
    lat,
    lng,
  });

  return res.data;
}