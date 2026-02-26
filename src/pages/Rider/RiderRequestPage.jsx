import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createEstimate } from "../../features/estimates/estimatesSlice";
import { createTrip, dispatchTrip } from "../../features/trips/tripsSlice";
import { getErrorMessage, is409 } from "../../utils/errors";

export default function RiderRequestPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const vehicleId = params.get("vehicleId");

  const estimate = useAppSelector((s) => s.estimates.current);
  const estStatus = useAppSelector((s) => s.estimates.loading ? "loading" : "idle");
  const estError = useAppSelector((s) => s.estimates.error);

  const trip = useAppSelector((s) => s.trips.current);

  const [pickup, setPickup] = useState({ lat: 43.6532, lng: -79.3832 });
  const [dropoff, setDropoff] = useState({ lat: 43.7, lng: -79.4 });
  const [actionError, setActionError] = useState(null);
  const [dispatching, setDispatching] = useState(false);

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
    await dispatch(createEstimate({ pickup, dropoff }));
  }

  async function onCreateTripAndDispatch() {
    setActionError(null);
    setDispatching(true);

    try {
      const estId = estimate?.estimateId;
      if (!estId) throw new Error("No estimateId found. Create an estimate first.");

      const created = await dispatch(createTrip({ estimateId: estId, vehicleId }));
      if (!createTrip.fulfilled.match(created)) {
          throw created.payload || created.error;
        }

      const tripId = created.payload?.trip?._id || created.payload?._id;
      if (!tripId) throw new Error("Trip created but missing _id");

      const disp = await dispatch(dispatchTrip(tripId));
      if (!dispatchTrip.fulfilled.match(disp)) {
        // 409 is expected business case
        if (is409(disp.payload)) {
          setActionError(disp.payload);
          return;
        }
        throw disp.payload || disp.error;
      }

      navigate(`/rider/trip/${tripId}`);
    } catch (e) {
      setActionError(e);
    } finally {
      setDispatching(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>Request a Driver</h2>
      <div style={{ marginBottom: 10 }}>Using vehicle: <b>{vehicleId}</b></div>

      {estError ? (
        <div style={{ background: "#fee", padding: 10, marginBottom: 12 }}>
          {getErrorMessage(estError, "Estimate failed")}
        </div>
      ) : null}

      {actionError ? (
        <div style={{ background: "#fee", padding: 10, marginBottom: 12 }}>
          {getErrorMessage(actionError, "Action failed")}
        </div>
      ) : null}

      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <h4>Pickup</h4>
        <input
          value={pickup.lat}
          onChange={(e) => setPickup((p) => ({ ...p, lat: Number(e.target.value) }))}
          placeholder="pickup lat"
        />
        <input
          value={pickup.lng}
          onChange={(e) => setPickup((p) => ({ ...p, lng: Number(e.target.value) }))}
          placeholder="pickup lng"
        />

        <h4>Dropoff</h4>
        <input
          value={dropoff.lat}
          onChange={(e) => setDropoff((p) => ({ ...p, lat: Number(e.target.value) }))}
          placeholder="dropoff lat"
        />
        <input
          value={dropoff.lng}
          onChange={(e) => setDropoff((p) => ({ ...p, lng: Number(e.target.value) }))}
          placeholder="dropoff lng"
        />

        <button onClick={onEstimate} disabled={estStatus === "loading"}>
          {estStatus === "loading" ? "Estimating…" : "Get Estimate"}
        </button>
      </div>

      {estimate ? (
        <div style={{ marginTop: 18, border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          <div><b>Estimate</b></div>
          <div>Distance: {estimate.distance_km} km</div>
          <div>Duration: {estimate.duration_minutes} min</div>
          <div>Fare: {estimate.fare?.total} {estimate.fare?.currency}</div>
          <div>Expires: {new Date(estimate.expiresAt).toLocaleString()}</div>

          <button style={{ marginTop: 12 }} onClick={onCreateTripAndDispatch} disabled={dispatching}>
            {dispatching ? "Dispatching…" : "Create Trip + Dispatch"}
          </button>
        </div>
      ) : null}

      {trip ? <div style={{ marginTop: 10, opacity: 0.7 }}>Current trip: {trip._id}</div> : null}
    </div>
  );
}