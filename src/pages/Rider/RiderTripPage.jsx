import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useTripPolling } from "../../hooks/useTripPolling";

export default function RiderTripPage() {
  const { id } = useParams();

  useTripPolling(id, {
    enabled: true,
    intervalMs: 2500,
    stopOn: ["COMPLETED"],
  });

  const trip = useAppSelector((s) => s.trips.current);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>Trip</h2>
      <div>Trip ID: <b>{id}</b></div>

      {!trip ? (
        <div style={{ marginTop: 12 }}>Loading trip…</div>
      ) : (
        <div style={{ marginTop: 12, border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          <div>Status: <b>{trip.status}</b></div>
          <div>Fare: {trip.fare_amount} {trip.currency}</div>

          <hr />

          <div><b>Rider</b>: {trip.rider?.name || trip.rider?._id || "—"}</div>
          <div><b>Driver</b>: {trip.driverProfile?.user?.name || "—"}</div>
          <div><b>Vehicle</b>: {trip.vehicle?.make} {trip.vehicle?.model} ({trip.vehicle?.plateNumber})</div>
        </div>
      )}
    </div>
  );
}