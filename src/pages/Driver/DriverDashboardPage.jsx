// src/pages/Driver/DriverDashboardPage.jsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { fetchTripById, arriveTrip, startTrip, completeTrip } from "../../features/trips/tripsSlice";
import { useTripPolling } from "../../hooks/useTripPolling";
import { getMyDriverProfile, updateMyDriverStatus } from "../../features/driverProfiles/driverProfilesSlice";

export default function DriverDashboardPage() {
  const dispatch = useAppDispatch();

  const trip = useAppSelector((s) => s.trips.current);
  const tripLoading = useAppSelector((s) => s.trips.loading);

  const driverProfile = useAppSelector((s) => s.driverProfiles.me);
  const dpLoading = useAppSelector((s) => s.driverProfiles.loading);

  const activeTripId = driverProfile?.activeTrip || null;

  // poll trip if active
  useTripPolling(activeTripId);

  useEffect(() => {
    dispatch(getMyDriverProfile());
  }, [dispatch]);

  useEffect(() => {
    if (activeTripId) dispatch(fetchTripById(activeTripId));
  }, [dispatch, activeTripId]);

  const toggleAvailability = () => {
    const next = driverProfile?.availability === "AVAILABLE" ? "OFFLINE" : "AVAILABLE";
    dispatch(updateMyDriverStatus({ availability: next }));
  };

  const tripId = trip?._id;

  return (
    <div style={{ padding: 20 }}>
      <h3>Driver Dashboard (Phase 4)</h3>

      <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <h4>Status</h4>

        {dpLoading ? (
          <p>Loading driver profile...</p>
        ) : driverProfile ? (
          <>
            <p><b>Verification:</b> {driverProfile.verificationStatus}</p>
            <p><b>Availability:</b> {driverProfile.availability}</p>
            <p><b>Active Trip:</b> {String(driverProfile.activeTrip || "None")}</p>

            <button onClick={toggleAvailability} disabled={dpLoading}>
              Toggle Available / Offline
            </button>
          </>
        ) : (
          <p>No driver profile found. Create it first.</p>
        )}
      </div>

      <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <h4>Current Trip</h4>

        {!activeTripId ? (
          <p>No active trip assigned right now.</p>
        ) : !trip ? (
          <p>Loading trip...</p>
        ) : (
          <>
            <p><b>Trip ID:</b> {trip._id}</p>
            <p><b>Status:</b> {trip.status}</p>
            <p><b>Fare:</b> {trip.fare_amount} {trip.currency}</p>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {trip.status === "ASSIGNED" && (
                <button disabled={tripLoading} onClick={() => dispatch(arriveTrip(tripId))}>
                  Arrive
                </button>
              )}

              {trip.status === "ENROUTE" && (
                <button disabled={tripLoading} onClick={() => dispatch(startTrip(tripId))}>
                  Start
                </button>
              )}

              {trip.status === "DRIVING" && (
                <button disabled={tripLoading} onClick={() => dispatch(completeTrip(tripId))}>
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