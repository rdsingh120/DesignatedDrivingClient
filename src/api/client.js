// src/api/client.js
import { http } from "./http";
import { API } from "./endpoints";

// Vehicles
export const apiGetMyVehicles = () => http.get(API.VEHICLES.MINE);
export const apiCreateVehicle = (payload) => http.post(API.VEHICLES.CREATE, payload);
export const apiDeleteVehicle = (id) => http.delete(API.VEHICLES.DELETE(id));

// Estimates
export const apiCreateEstimate = (payload) => http.post(API.ESTIMATES.CREATE, payload);

// Trips
export const apiCreateTrip = (payload) => http.post(API.TRIPS.CREATE_FROM_ESTIMATE, payload);
//export const apiDispatchTrip = (id) => http.post(API.TRIPS.DISPATCH(id));
export const apiGetTripById = (id) => http.get(API.TRIPS.BY_ID(id));
export const apiGetMyTrips = () => http.get(API.TRIPS.MINE);
export const apiGetOpenTrips = () => http.get(API.TRIPS.OPEN);
export const apiAcceptTrip = (id) => http.post(API.TRIPS.ACCEPT(id));

// Driver lifecycle (for Phase 4)
export const apiArriveTrip = (id) => http.post(API.TRIPS.ARRIVE(id));
export const apiStartTrip = (id) => http.post(API.TRIPS.START(id));
export const apiCompleteTrip = (id) => http.post(API.TRIPS.COMPLETE(id));
export const apiCancelTrip = (id) => http.post(API.TRIPS.CANCEL(id));

// Incidents
export const apiReportIssue = (tripId, payload) => http.post(API.TRIPS.REPORT(tripId), payload);

// Notifications
export const apiGetMyNotifications = () => http.get(API.NOTIFICATIONS.MINE);
export const apiMarkAllNotificationsAsRead = () => http.patch(API.NOTIFICATIONS.READ_ALL);
export const apiMarkNotificationAsRead = (id) => http.patch(API.NOTIFICATIONS.READ_ONE(id));