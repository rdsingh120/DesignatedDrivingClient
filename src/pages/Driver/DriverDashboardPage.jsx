// src/pages/Driver/DriverDashboardPage.jsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useTripPolling } from "../../hooks/useTripPolling";

import RoutePreviewMap from "../../features/estimates/components/RoutePreviewMap";

import {
  getMyDriverProfile,
  updateMyDriverStatus,
  createMyDriverProfile,
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

  const [selectedTrip, setSelectedTrip] = useState(null);

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

  // Keep selected trip valid when openTrips refreshes
  useEffect(() => {
    if (!selectedTrip && openTrips?.length) {
      setSelectedTrip(openTrips[0]);
      return;
    }
    if (selectedTrip && openTrips?.length) {
      const stillThere = openTrips.find((t) => t._id === selectedTrip._id);
      if (!stillThere) setSelectedTrip(openTrips[0] || null);
      else setSelectedTrip(stillThere);
    }
  }, [openTrips, selectedTrip]);

  const toggleAvailability = () => {
    const next =
      driverProfile?.availability === "AVAILABLE" ? "OFFLINE" : "AVAILABLE";
    dispatch(updateMyDriverStatus({ availability: next }));
  };

  const tripId = trip?._id;

  const canShowMarketplace =
    !activeTripId &&
    driverProfile?.availability === "AVAILABLE" &&
    driverProfile?.verificationStatus === "VERIFIED";

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
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
              <b>Active Trip:</b> {String(driverProfile.activeTrip || "None")}
            </p>

            <button onClick={toggleAvailability} disabled={dpLoading}>
              Toggle Available / Offline
            </button>
          </>
        ) : (
          <>
            <p>No driver profile found.</p>
            <button onClick={() => dispatch(createMyDriverProfile())}>
              Create Driver Profile
            </button>
          </>
        )}
      </div>

      {/* Marketplace */}
      {canShowMarketplace && (
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 12 }}>
              {/* Left: list */}
              <div style={{ maxHeight: 520, overflowY: "auto" }}>
                {openTrips.map((t) => {
                  const isSelected = selectedTrip?._id === t._id;
                  return (
                    <div
                      key={t._id}
                      onClick={() => setSelectedTrip(t)}
                      style={{
                        cursor: "pointer",
                        border: isSelected ? "2px solid #333" : "1px solid #eee",
                        padding: 10,
                        marginBottom: 8,
                        borderRadius: 8,
                        background: isSelected ? "#fafafa" : "white",
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
                      <div style={{ marginTop: 6, fontSize: 13, opacity: 0.8 }}>
                        {t.pickup_display_address || t.pickup_address || "—"}
                      </div>
                      <div style={{ fontSize: 13, opacity: 0.8 }}>
                        {t.dropoff_display_address || t.dropoff_address || "—"}
                      </div>

                      <button
                        style={{ marginTop: 10 }}
                        disabled={tripLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(acceptTrip(t._id));
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Right: map preview */}
              <div>
                {!selectedTrip ? (
                  <div style={{ padding: 12, border: "1px dashed #ccc", borderRadius: 8 }}>
                    Select a trip to preview the route.
                  </div>
                ) : (
                  <>
                    <RoutePreviewMap
                      pickup={selectedTrip.pickup_geo}
                      dropoff={selectedTrip.dropoff_geo}
                      route_polyline={selectedTrip.route_polyline}
                      height={520}
                    />
                    <div
                      style={{
                        marginTop: 10,
                        padding: 10,
                        border: "1px solid #eee",
                        borderRadius: 8,
                      }}
                    >
                      <div>
                        <b>Pickup:</b>{" "}
                        {selectedTrip.pickup_display_address || selectedTrip.pickup_address}
                      </div>
                      <div>
                        <b>Dropoff:</b>{" "}
                        {selectedTrip.dropoff_display_address || selectedTrip.dropoff_address}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
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
            <div style={{ marginTop: 12, marginBottom: 14 }}>
              <RoutePreviewMap
                pickup={trip.pickup_geo}
                dropoff={trip.dropoff_geo}
                route_polyline={trip.route_polyline}
                height={360}
              />
            </div>

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