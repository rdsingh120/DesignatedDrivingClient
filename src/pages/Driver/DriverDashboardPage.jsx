// src/pages/Driver/DriverDashboardPage.jsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useTripPolling } from "../../hooks/useTripPolling";

import {
  getMyDriverProfile,
  updateMyDriverStatus,
} from "../../features/driver/driverProfilesSlice";

import {
  fetchTripById,
  fetchOpenTrips,
  acceptTrip,
  arriveTrip,
  startTrip,
  completeTrip,
} from "../../features/trips/tripsSlice";

export default function DriverDashboardPage() {
  const dispatch = useAppDispatch();

  const trip = useAppSelector((s) => s.trips.current);
  const openTrips = useAppSelector((s) => s.trips.open);
  const tripLoading = useAppSelector((s) => s.trips.loading);

  const driverProfile = useAppSelector((s) => s.driverProfiles.me);
  const dpLoading = useAppSelector((s) => s.driverProfiles.loading);

  const activeTripId = driverProfile?.activeTrip || null;

  // Poll active trip
  useTripPolling(activeTripId);

  useEffect(() => {
    dispatch(getMyDriverProfile());
  }, [dispatch]);

  useEffect(() => {
    if (activeTripId) {
      dispatch(fetchTripById(activeTripId));
    }
  }, [dispatch, activeTripId]);

  // Load marketplace when available + no active trip
  useEffect(() => {
    if (
      driverProfile?.availability === "AVAILABLE" &&
      !driverProfile?.activeTrip
    ) {
      dispatch(fetchOpenTrips());
    }
  }, [dispatch, driverProfile]);

  const toggleAvailability = () => {
    const next =
      driverProfile?.availability === "AVAILABLE"
        ? "OFFLINE"
        : "AVAILABLE";
    dispatch(updateMyDriverStatus({ availability: next }));
  };

  const tripId = trip?._id;

  return (
    <div style={{ padding: 20 }}>
      <h3>Driver Dashboard (Phase 4b — Marketplace)</h3>

      {/* Driver Status */}
      <div
        style={{
          marginTop: 12,
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h4>Status</h4>

        {dpLoading ? (
          <p>Loading driver profile...</p>
        ) : driverProfile ? (
          <>
            <p>
              <b>Verification:</b> {driverProfile.verificationStatus}
            </p>
            <p>
              <b>Availability:</b> {driverProfile.availability}
            </p>
            <p>
              <b>Active Trip:</b>{" "}
              {String(driverProfile.activeTrip || "None")}
            </p>

            <button onClick={toggleAvailability} disabled={dpLoading}>
              Toggle Available / Offline
            </button>
          </>
        ) : (
          <p>No driver profile found. Create it first.</p>
        )}
      </div>

      {/* Marketplace */}
      {!activeTripId &&
        driverProfile?.availability === "AVAILABLE" &&
        driverProfile?.verificationStatus === "VERIFIED" && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          >
            <h4>Open Trips</h4>

            {openTrips.length === 0 ? (
              <p>No open trips right now.</p>
            ) : (
              openTrips.map((t) => (
                <div
                  key={t._id}
                  style={{
                    border: "1px solid #eee",
                    padding: 10,
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <b>Fare:</b> {t.fare_amount} {t.currency}
                  </div>
                  <div>
                    <b>Distance:</b> {t.distance_km} km
                  </div>
                  <div>
                    <b>Status:</b> {t.status}
                  </div>

                  <button
                    disabled={tripLoading}
                    onClick={() => dispatch(acceptTrip(t._id))}
                  >
                    Accept
                  </button>
                </div>
              ))
            )}
          </div>
        )}

      {/* Current Trip */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h4>Current Trip</h4>

        {!activeTripId ? (
          <p>No active trip assigned right now.</p>
        ) : !trip ? (
          <p>Loading trip...</p>
        ) : (
          <>
            <p>
              <b>Trip ID:</b> {trip._id}
            </p>
            <p>
              <b>Status:</b> {trip.status}
            </p>
            <p>
              <b>Fare:</b> {trip.fare_amount} {trip.currency}
            </p>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {trip.status === "ASSIGNED" && (
                <button
                  disabled={tripLoading}
                  onClick={() => dispatch(arriveTrip(tripId))}
                >
                  Arrive
                </button>
              )}

              {trip.status === "ENROUTE" && (
                <button
                  disabled={tripLoading}
                  onClick={() => dispatch(startTrip(tripId))}
                >
                  Start
                </button>
              )}

              {trip.status === "DRIVING" && (
                <button
                  disabled={tripLoading}
                  onClick={() => dispatch(completeTrip(tripId))}
                >
                  Complete
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}