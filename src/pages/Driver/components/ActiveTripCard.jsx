import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  arriveTrip,
  startTrip,
  completeTrip,
  cancelTrip,
} from "../../../features/trips/tripsSlice";
import RoutePreviewMap from "../../../features/estimates/components/RoutePreviewMap";
import { cardStyle, sectionLabel, TRIP_STATUS_INFO } from "./driverDashboardStyles";
import { colors, alpha, gradients, modalOverlay, modalCard } from "../../../styles/theme";

function TripStatusBanner({ status }) {
  const info = TRIP_STATUS_INFO[status];
  if (!info) return null;
  return (
    <div style={{ background: info.bg, border: `1px solid ${info.border}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
      <div style={{ fontSize: 26, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>{info.icon}</div>
      <div>
        <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15, color: info.color }}>{info.title}</p>
        <p style={{ margin: 0, fontSize: 13, color: colors.textSecondary, lineHeight: 1.5 }}>{info.subtitle}</p>
      </div>
    </div>
  );
}

export default function ActiveTripCard() {
  const dispatch = useAppDispatch();
  const trip = useAppSelector((s) => s.trips.current);
  const tripLoading = useAppSelector((s) => s.trips.loading);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const tripId = trip?._id;
  const canCancel = trip?.status === "ASSIGNED" || trip?.status === "ENROUTE";

  if (!trip) {
    return (
      <div style={cardStyle}>
        <p style={sectionLabel}>Active Trip</p>
        <p style={{ margin: 0, color: colors.textMuted, fontSize: 14 }}>Loading trip…</p>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <p style={sectionLabel}>Active Trip</p>

      <TripStatusBanner status={trip.status} />

      {/* Map */}
      <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <RoutePreviewMap
          pickup={trip.pickup_geo}
          dropoff={trip.dropoff_geo}
          route_polyline={trip.route_polyline}
          height={360}
        />
      </div>

      {/* Trip details */}
      <div style={{ background: colors.bgDeep, borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Pickup</p>
          <p style={{ margin: 0, fontSize: 14, color: colors.textPrimary }}>{trip.pickup_display_address || trip.pickup_address || "—"}</p>
        </div>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Dropoff</p>
          <p style={{ margin: 0, fontSize: 14, color: colors.textPrimary }}>{trip.dropoff_display_address || trip.dropoff_address || "—"}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
          <span style={{ fontSize: 13, color: colors.textMuted }}>Fare</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: colors.primary }}>{trip.fare_amount} {trip.currency}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        {trip.status === "ASSIGNED" && (
          <button
            disabled={tripLoading}
            onClick={() => dispatch(arriveTrip(tripId))}
            style={{ flex: 1, padding: "12px 0", background: gradients.primary, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, opacity: tripLoading ? 0.6 : 1 }}
          >
            I've Arrived at Pickup
          </button>
        )}
        {trip.status === "ENROUTE" && (
          <button
            disabled={tripLoading}
            onClick={() => dispatch(startTrip(tripId))}
            style={{ flex: 1, padding: "12px 0", background: gradients.primary, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, opacity: tripLoading ? 0.6 : 1 }}
          >
            Start Trip
          </button>
        )}
        {trip.status === "DRIVING" && (
          <button
            disabled={tripLoading}
            onClick={() => dispatch(completeTrip(tripId))}
            style={{ flex: 1, padding: "12px 0", background: gradients.success, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, opacity: tripLoading ? 0.6 : 1 }}
          >
            Complete Trip
          </button>
        )}
        {canCancel && (
          <button
            disabled={tripLoading}
            onClick={() => setShowCancelConfirm(true)}
            style={{ padding: "12px 18px", background: "transparent", color: colors.dangerLight, border: `1px solid ${colors.dangerDeep}`, borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, opacity: tripLoading ? 0.6 : 1 }}
          >
            Cancel Trip
          </button>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {showCancelConfirm && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: alpha.danger15, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 22 }}>
              ⚠️
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>Cancel this trip?</h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: colors.textMuted, lineHeight: 1.5 }}>
              The rider will be notified. You'll be set back to available so you can accept new trips.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                style={{ flex: 1, padding: "10px 0", background: "transparent", border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.textSecondary, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                onClick={() => setShowCancelConfirm(false)}
              >
                Keep Trip
              </button>
              <button
                disabled={tripLoading}
                style={{ flex: 1, padding: "10px 0", background: colors.dangerDark, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14, opacity: tripLoading ? 0.6 : 1 }}
                onClick={() => {
                  dispatch(cancelTrip(tripId));
                  setShowCancelConfirm(false);
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
