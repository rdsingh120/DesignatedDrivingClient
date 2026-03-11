import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useTripPolling } from "../../hooks/useTripPolling";
import { cancelTrip } from "../../features/trips/tripsSlice";
import { colors, alpha, cardStyle, pageStyle, btn, modalOverlay, modalCard } from "../../styles/theme";

import RoutePreviewMap from "../../features/estimates/components/RoutePreviewMap";
import StatusBadge from "./components/StatusBadge";
import StatusTracker from "./components/StatusTracker";

function formatTime(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function RiderTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showCancelModal, setShowCancelModal] = useState(false);

  useTripPolling(id);

  const trip = useAppSelector((s) => s.trips.current);
  const tripLoading = useAppSelector((s) => s.trips.loading);
  const tripError = useAppSelector((s) => s.trips.error);

  const driverName = trip?.driverProfile?.user?.name;
  const isTerminal = trip?.status === "COMPLETED" || trip?.status === "CANCELLED";
  const canCancel = trip?.status === "REQUESTED" || trip?.status === "ASSIGNED";
  const hasFee = trip?.status === "ASSIGNED";

  return (
    <div style={pageStyle}>

      {/* Header */}
      <div style={{ padding: "20px 24px 0", marginBottom: 24 }}>
        <button
          onClick={() => navigate("/rider")}
          style={{ background: "none", border: "none", color: colors.textSecondary, cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 16 }}
        >
          ← Dashboard
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Your Trip</h2>
          {trip && <StatusBadge status={trip.status} />}
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: colors.textFaint, fontFamily: "monospace" }}>{id}</p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

        {/* Loading state */}
        {!trip && tripLoading && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔄</div>
            <p style={{ margin: 0, fontSize: 15, color: colors.textSecondary }}>Loading trip details...</p>
          </div>
        )}

        {/* Error state */}
        {!trip && !tripLoading && tripError && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <p style={{ margin: "0 0 8px", fontSize: 15, color: colors.dangerLight }}>Failed to load trip</p>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: colors.textMuted }}>{tripError}</p>
            <button style={btn.secondary} onClick={() => navigate("/rider")}>
              Back to Dashboard
            </button>
          </div>
        )}

        {trip && (
          <>
            {/* Real-time status tracker */}
            <StatusTracker status={trip.status} />

            {/* Cancel button */}
            {canCancel && (
              <div style={{ marginBottom: 16, textAlign: "center" }}>
                <button
                  disabled={tripLoading}
                  onClick={() => setShowCancelModal(true)}
                  style={{
                    background: "transparent",
                    border: `1px solid ${colors.dangerDeep}`,
                    color: colors.dangerLight,
                    borderRadius: 8,
                    padding: "10px 24px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                    opacity: tripLoading ? 0.6 : 1,
                  }}
                >
                  Cancel Request
                </button>
              </div>
            )}

            {/* Completion actions */}
            {trip.status === "COMPLETED" && (
              <div style={{ ...cardStyle, textAlign: "center", padding: "24px 20px" }}>
                <p style={{ margin: "0 0 16px", fontSize: 14, color: colors.textSecondary }}>
                  How was your ride{driverName ? ` with ${driverName}` : ""}?
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link to="/rider/history" style={{ textDecoration: "none" }}>
                    <button style={btn.primary}>Rate Your Driver</button>
                  </Link>
                  <button style={btn.ghost} onClick={() => navigate("/rider")}>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Cancelled actions */}
            {trip.status === "CANCELLED" && (
              <div style={{ ...cardStyle, textAlign: "center", padding: "24px 20px" }}>
                <p style={{ margin: "0 0 16px", fontSize: 14, color: colors.textSecondary }}>
                  This trip was cancelled. You can book a new ride from the dashboard.
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button style={btn.primary} onClick={() => navigate("/rider/request")}>
                    Book a New Ride
                  </button>
                  <button style={btn.ghost} onClick={() => navigate("/rider")}>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Map */}
            <div style={{ ...cardStyle, padding: 0, overflow: "hidden", marginBottom: 16 }}>
              <RoutePreviewMap
                pickup={trip.pickup_geo}
                dropoff={trip.dropoff_geo}
                route_polyline={trip.route_polyline}
                height={420}
              />
            </div>

            {/* Fare */}
            <div style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, color: colors.textMuted }}>Fare</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>
                {trip.fare_amount} {trip.currency}
              </span>
            </div>

            {/* Route */}
            <div style={cardStyle}>
              <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 13, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Route</p>
              <div style={{ background: colors.bgDeep, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Pickup</p>
                  <p style={{ margin: 0, fontSize: 14, color: colors.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{trip.pickup_display_address || trip.pickup_address}</p>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Dropoff</p>
                  <p style={{ margin: 0, fontSize: 14, color: colors.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{trip.dropoff_display_address || trip.dropoff_address}</p>
                </div>
              </div>
            </div>

            {/* People & vehicle */}
            <div style={cardStyle}>
              <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 13, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Details</p>
              <div style={{ background: colors.bgDeep, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
                  <span style={{ fontSize: 13, color: colors.textMuted }}>Rider</span>
                  <span style={{ fontSize: 14, color: colors.textPrimary }}>{trip.rider?.name || trip.rider?._id || "—"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
                  <span style={{ fontSize: 13, color: colors.textMuted }}>Driver</span>
                  {driverName ? (
                    <span style={{ fontSize: 14, color: colors.textPrimary }}>{driverName}</span>
                  ) : (
                    <span style={{ fontSize: 13, color: colors.infoLight, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.infoLight, display: "inline-block", animation: "pulse 1.5s infinite" }} />
                      Waiting for a driver...
                    </span>
                  )}
                </div>
                {(trip.status === "ASSIGNED" || trip.status === "ENROUTE") && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderBottom: `1px solid ${colors.borderSubtle}`,
                  }}
                >
                  <span style={{ fontSize: 13, color: colors.textMuted }}>Driver ETA</span>

                  {trip.driver_eta_minutes ? (
                    <span style={{ fontSize: 14, color: colors.textPrimary }}>
                      {Math.round(trip.driver_eta_minutes)} minutes
                    </span>
                  ) : (
                    <span style={{ fontSize: 13, color: colors.textMuted }}>
                      Calculating...
                    </span>
                  )}
                </div>
                  )}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                  <span style={{ fontSize: 13, color: colors.textMuted }}>Vehicle</span>
                  <span style={{ fontSize: 14, color: colors.textPrimary }}>
                    {trip.vehicle?.make} {trip.vehicle?.model} ({trip.vehicle?.plateNumber})
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            {(trip.requestedAt || trip.createdAt || trip.startedAt || trip.completedAt || trip.cancelledAt) && (
              <div style={cardStyle}>
                <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 13, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Timeline</p>
                <div style={{ background: colors.bgDeep, borderRadius: 10, overflow: "hidden" }}>
                  {(trip.requestedAt || trip.createdAt) && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
                      <span style={{ fontSize: 13, color: colors.textMuted }}>Requested</span>
                      <span style={{ fontSize: 14, color: colors.textPrimary }}>{formatTime(trip.requestedAt || trip.createdAt)}</span>
                    </div>
                  )}
                  {trip.assignedAt && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
                      <span style={{ fontSize: 13, color: colors.textMuted }}>Driver Assigned</span>
                      <span style={{ fontSize: 14, color: colors.textPrimary }}>{formatTime(trip.assignedAt)}</span>
                    </div>
                  )}
                  {trip.startedAt && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
                      <span style={{ fontSize: 13, color: colors.textMuted }}>Trip Started</span>
                      <span style={{ fontSize: 14, color: colors.textPrimary }}>{formatTime(trip.startedAt)}</span>
                    </div>
                  )}
                  {trip.completedAt && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
                      <span style={{ fontSize: 13, color: colors.textMuted }}>Completed</span>
                      <span style={{ fontSize: 14, color: colors.textPrimary }}>{formatTime(trip.completedAt)}</span>
                    </div>
                  )}
                  {trip.cancelledAt && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                      <span style={{ fontSize: 13, color: colors.dangerLight }}>Cancelled</span>
                      <span style={{ fontSize: 14, color: colors.dangerLight }}>{formatTime(trip.cancelledAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>
              Cancel your request?
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: colors.textMuted, lineHeight: 1.5 }}>
              {hasFee
                ? "A cancellation fee will apply because a driver has already been assigned to your trip."
                : "Your request will be removed and no driver will be matched."}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  flex: 1, padding: "10px 0", background: "transparent",
                  border: `1px solid ${colors.border}`, borderRadius: 8,
                  color: colors.textSecondary, cursor: "pointer", fontWeight: 600, fontSize: 14,
                }}
              >
                Keep Request
              </button>
              <button
                disabled={tripLoading}
                onClick={() => { dispatch(cancelTrip(id)); setShowCancelModal(false); }}
                style={{
                  flex: 1, padding: "10px 0", background: colors.dangerDark,
                  border: "none", borderRadius: 8, color: "#fff",
                  cursor: "pointer", fontWeight: 600, fontSize: 14,
                  opacity: tripLoading ? 0.6 : 1,
                }}
              >
                {hasFee ? "Cancel & Accept Fee" : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
