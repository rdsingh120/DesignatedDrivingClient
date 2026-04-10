import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createEstimate } from "../../features/estimates/estimatesSlice";
import { createTrip } from "../../features/trips/tripsSlice";
import { fetchMyVehicles } from "../../features/vehicles/vehiclesSlice";
import { getErrorMessage } from "../../utils/errors";
import { colors, pageStyle, cardStyle, inputStyle, btn, errorBanner } from "../../styles/theme";

import RoutePreviewMap from "../../features/estimates/components/RoutePreviewMap";

export default function RiderRequestPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const quickAddress = params.get("address");

  // vehicleId from URL param (original flow) or local selection (dashboard flow)
  const urlVehicleId = params.get("vehicleId");
  const [selectedVehicleId, setSelectedVehicleId] = useState(urlVehicleId || "");

  const vehicles = useAppSelector((s) => s.vehicles.items);
  const vehiclesLoading = useAppSelector((s) => s.vehicles.loading);

  const estimate = useAppSelector((s) => s.estimates.current);
  const estStatus = useAppSelector((s) =>
    s.estimates.loading ? "loading" : "idle"
  );
  const estError = useAppSelector((s) => s.estimates.error);

  const trip = useAppSelector((s) => s.trips.current);

  const [pickup_address, setPickupAddress] = useState(
    "100 King St W, Toronto, ON"
  );
  const [dropoff_address, setDropoffAddress] = useState(
    quickAddress || "1 Yonge St, Toronto, ON"
  );
  const [actionError, setActionError] = useState(null);
  const [hasEstimated, setHasEstimated] = useState(false);

  // Only fetch vehicles when no vehicleId came from the URL
  useEffect(() => {
    if (!urlVehicleId) {
      dispatch(fetchMyVehicles());
    }
  }, [dispatch, urlVehicleId]);

  // Resolve final vehicleId — prefer URL param, fall back to user's selection
  const vehicleId = urlVehicleId || selectedVehicleId;

  // Label to display — show make/model if we have the full vehicle object
  const selectedVehicle = vehicles.find((v) => v._id === vehicleId);
  const vehicleLabel = selectedVehicle
    ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plateNumber})`
    : vehicleId;

  async function onEstimate() {
    setActionError(null);
    await dispatch(createEstimate({ pickup_address, dropoff_address }));
    setHasEstimated(true);
  }

  async function onCreateTrip() {
    setActionError(null);

    try {
      const estId = estimate?.estimateId;
      if (!estId)
        throw new Error("No estimateId found. Create an estimate first.");

      const created = await dispatch(createTrip({ estimateId: estId, vehicleId }));

      if (!createTrip.fulfilled.match(created)) {
        throw created.payload || created.error;
      }

      const tripId = created.payload?._id;
      if (!tripId) throw new Error("Trip created but missing _id");

      navigate(`/rider/trip/${tripId}`);
    } catch (e) {
      setActionError(e);
    }
  }

  const mapPickup = estimate?.pickup_geo || null;
  const mapDropoff = estimate?.dropoff_geo || null;
  const mapPolyline = estimate?.route_polyline || null;

  return (
    <div style={pageStyle}>

      {/* Header */}
      <div style={{ padding: "20px 24px 0", marginBottom: 24 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: colors.textSecondary, cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 16 }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Request a Driver</h2>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

        {/* Vehicle selection — inline picker when no vehicleId in URL */}
        <div style={cardStyle}>
          <p style={{ margin: "0 0 10px", fontWeight: 600, fontSize: 14, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Vehicle</p>

          {urlVehicleId ? (
            // Came from vehicles page — just display it
            <div style={{ fontSize: 15, color: colors.textPrimary }}>
              {vehicleLabel}
            </div>
          ) : vehiclesLoading ? (
            <p style={{ margin: 0, color: colors.textMuted, fontSize: 14 }}>Loading your vehicles…</p>
          ) : vehicles.length === 0 ? (
            <div>
              <p style={{ margin: "0 0 10px", color: colors.dangerLight, fontSize: 14 }}>No vehicles found. Add one first.</p>
              <button style={btn.secondary} onClick={() => navigate("/rider/vehicles")}>
                Go to My Vehicles
              </button>
            </div>
          ) : (
            // Came from dashboard — let the user pick inline
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="">— Select a vehicle —</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.year} {v.make} {v.model} ({v.plateNumber})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Only show the rest once a vehicle is chosen */}
        {vehicleId && (
          <>
            {estError && (
              <div style={errorBanner}>
                {getErrorMessage(estError, "Estimate failed")}
              </div>
            )}

            {actionError && (
              <div style={errorBanner}>
                {getErrorMessage(actionError, "Action failed")}
              </div>
            )}

            {/* Map */}
            <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
              <RoutePreviewMap
                pickup={mapPickup}
                dropoff={mapDropoff}
                route_polyline={mapPolyline}
                height={420}
              />
            </div>

            {/* Address inputs */}
            <div style={cardStyle}>
              <p style={{ margin: "0 0 10px", fontWeight: 600, fontSize: 14, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Route</p>

              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 13, color: colors.textMuted, display: "block", marginBottom: 4 }}>Pickup</label>
                  <input
                    style={inputStyle}
                    value={pickup_address}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Pickup address (e.g., 100 King St W, Toronto, ON)"
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, color: colors.textMuted, display: "block", marginBottom: 4 }}>Dropoff</label>
                  <input
                    style={inputStyle}
                    value={dropoff_address}
                    onChange={(e) => setDropoffAddress(e.target.value)}
                    placeholder="Dropoff address (e.g., 1 Yonge St, Toronto, ON)"
                  />
                </div>

                <button
                  style={{ ...btn.primary, opacity: estStatus === "loading" ? 0.6 : 1 }}
                  onClick={onEstimate}
                  disabled={estStatus === "loading"}
                >
                  {estStatus === "loading" ? "Estimating…" : "Get Estimate"}
                </button>
              </div>
            </div>

            {/* Estimate result */}
            {hasEstimated && estimate && (
              <div style={cardStyle}>
                <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 14, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Fare Estimate</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <div style={{ background: colors.bgDeep, borderRadius: 10, padding: "12px 16px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Distance</p>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{estimate.distance_km} km</p>
                  </div>
                  <div style={{ background: colors.bgDeep, borderRadius: 10, padding: "12px 16px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Duration</p>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{estimate.duration_minutes} min</p>
                  </div>
                  <div style={{ background: colors.bgDeep, borderRadius: 10, padding: "12px 16px", gridColumn: "1 / -1" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Fare</p>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.primary }}>
                      {estimate.fare?.total} {estimate.fare?.currency}
                    </p>
                  </div>
                </div>

                <p style={{ margin: "0 0 14px", fontSize: 12, color: colors.textMuted }}>
                  Expires: {new Date(estimate.expiresAt).toLocaleString()}
                </p>

                <button style={btn.primary} onClick={onCreateTrip}>
                  Confirm &amp; Create Trip
                </button>
              </div>
            )}

            {trip && (
              <div style={{ marginTop: 10, opacity: 0.7, fontSize: 13, color: colors.textSecondary }}>
                Current trip: {trip._id}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
