import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createEstimate } from "../../features/estimates/estimatesSlice";
import { createTrip } from "../../features/trips/tripsSlice";
import { getErrorMessage } from "../../utils/errors";

import RoutePreviewMap from "../../features/estimates/components/RoutePreviewMap";

export default function RiderRequestPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const vehicleId = params.get("vehicleId");

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
    "1 Yonge St, Toronto, ON"
  );
  const [actionError, setActionError] = useState(null);

  if (!vehicleId) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Request a Driver</h2>
        <p>Missing vehicleId. Go back and select a vehicle first.</p>
      </div>
    );
  }

  async function onEstimate() {
    setActionError(null);
    await dispatch(createEstimate({ pickup_address, dropoff_address }));
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
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>Request a Driver</h2>

      <div style={{ marginBottom: 10 }}>
        Using vehicle: <b>{vehicleId}</b>
      </div>

      {estError && (
        <div style={{ background: "#fee", padding: 10, marginBottom: 12 }}>
          {getErrorMessage(estError, "Estimate failed")}
        </div>
      )}

      {actionError && (
        <div style={{ background: "#fee", padding: 10, marginBottom: 12 }}>
          {getErrorMessage(actionError, "Action failed")}
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <RoutePreviewMap
          pickup={mapPickup}
          dropoff={mapDropoff}
          route_polyline={mapPolyline}
          height={420}
        />
      </div>

      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <h4>Pickup</h4>
        <input
          value={pickup_address}
          onChange={(e) => setPickupAddress(e.target.value)}
          placeholder="Pickup address (e.g., 100 King St W, Toronto, ON)"
        />

        <h4>Dropoff</h4>
        <input
          value={dropoff_address}
          onChange={(e) => setDropoffAddress(e.target.value)}
          placeholder="Dropoff address (e.g., 1 Yonge St, Toronto, ON)"
        />

        <button onClick={onEstimate} disabled={estStatus === "loading"}>
          {estStatus === "loading" ? "Estimating…" : "Get Estimate"}
        </button>
      </div>

      {estimate && (
        <div
          style={{
            marginTop: 18,
            border: "1px solid #ddd",
            padding: 12,
            borderRadius: 8,
          }}
        >
          <div>
            <b>Estimate</b>
          </div>
          <div>Distance: {estimate.distance_km} km</div>
          <div>Duration: {estimate.duration_minutes} min</div>
          <div>
            Fare: {estimate.fare?.total} {estimate.fare?.currency}
          </div>
          <div>Expires: {new Date(estimate.expiresAt).toLocaleString()}</div>

          <button style={{ marginTop: 12 }} onClick={onCreateTrip}>
            Create Trip
          </button>
        </div>
      )}

      {trip && (
        <div style={{ marginTop: 10, opacity: 0.7 }}>
          Current trip: {trip._id}
        </div>
      )}
    </div>
  );
}