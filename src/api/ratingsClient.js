import { http } from "./http";

export const apiCreateRating = (data) =>
  http.post("/ratings", data);

export const apiGetUserRatings = (userId) =>
  http.get(`/ratings/user/${userId}`);

export const apiGetTripRatings = (tripId) =>
  http.get(`/ratings/trip/${tripId}`);