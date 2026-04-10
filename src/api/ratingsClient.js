import { http } from "./http";

export const apiCreateRating = (data) =>
  http.post("/api/ratings", data);

export const apiGetUserRatings = (userId) =>
  http.get(`/api/ratings/user/${userId}`);

export const apiGetTripRatings = (tripId) =>
  http.get(`/api/ratings/trip/${tripId}`);