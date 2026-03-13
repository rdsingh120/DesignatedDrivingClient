import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useTripPolling } from "../../hooks/useTripPolling";
import { colors, pageStyle, cardStyle } from "../../styles/theme";
import { useEffect, useState } from "react";
import { cancelTrip } from "../../features/trips/tripsSlice";

import RoutePreviewMap from "../../features/estimates/components/RoutePreviewMap";
import StatusBadge from "./components/StatusBadge";
import StatusTracker from "./components/StatusTracker";

function formatTime(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const btn = {
  primary: {
    background: colors.primary,
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  secondary: {
    background: colors.bgDeep,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    padding: "10px 18px",
    color: colors.textPrimary,
    cursor: "pointer",
  },
  ghost: {
    background: "transparent",
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    padding: "10px 18px",
    color: colors.textSecondary,
    cursor: "pointer",
  },
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalCard = {
  background: colors.bgCard,
  borderRadius: 12,
  padding: 24,
  width: 360,
};

export default function RiderTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [redirected, setRedirected] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useTripPolling(id);

  const trip = useAppSelector((s) => s.trips.current);
  const tripLoading = useAppSelector((s) => s.trips.loading);
  const tripError = useAppSelector((s) => s.trips.error);

  useEffect(() => {
    if (trip && trip.status === "COMPLETED" && !redirected) {
      setRedirected(true);
      navigate(`/rider/rate/${id}`);
    }
  }, [trip, redirected, navigate, id]);

  const driverName = trip?.driverProfile?.user?.name;
  const canCancel = trip?.status === "REQUESTED" || trip?.status === "ASSIGNED";
  const hasFee = trip?.status === "ASSIGNED";

  return (
    <div style={pageStyle}>

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

        {!trip && tripLoading && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔄</div>
            <p style={{ margin: 0, fontSize: 15, color: colors.textSecondary }}>Loading trip details...</p>
          </div>
        )}

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
            <StatusTracker status={trip.status} />

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

            <div style={{ ...cardStyle, padding: 0, overflow: "hidden", marginBottom: 16 }}>
              <RoutePreviewMap
                pickup={trip.pickup_geo}
                dropoff={trip.dropoff_geo}
                route_polyline={trip.route_polyline}
                height={420}
              />
            </div>

            <div style={{ ...cardStyle, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, color: colors.textMuted }}>Fare</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>
                {trip.fare_amount} {trip.currency}
              </span>
            </div>
            {/* Route */}
            <div style={cardStyle}>
              <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 13 }}>
                Route
              </p>

              <div style={{ background: colors.bgDeep, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Pickup</p>
                  <p style={{ margin: 0 }}>
                    {trip.pickup_display_address || trip.pickup_address}
                  </p>
                </div>

                <div style={{ padding: "12px 16px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Dropoff</p>
                  <p style={{ margin: 0 }}>
                    {trip.dropoff_display_address || trip.dropoff_address}
                  </p>
                </div>
              </div>
            </div> 
            {/* Details */}
            <div style={cardStyle}>
              <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 13 }}>
                Details
              </p>

              <div style={{ background: colors.bgDeep, borderRadius: 10 }}>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                  <span>Rider</span>
                  <span>{trip.rider?.name || trip.rider?._id}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                  <span>Driver</span>

                  {driverName ? (
                    <span>{driverName}</span>
                  ) : (
                    <span style={{ color: colors.infoLight }}>
                      Waiting for a driver...
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                  <span>Vehicle</span>
                  <span>
                    {trip.vehicle?.make} {trip.vehicle?.model} ({trip.vehicle?.plateNumber})
                  </span>
                </div>

              </div>
            </div>
            {(trip.status === "ASSIGNED" || trip.status === "ENROUTE") && (
            <div style={cardStyle}>
              <span style={{ fontSize: 13, color: colors.textMuted }}>Driver ETA</span>

              {trip.driver_eta_minutes ? (
                <span style={{ marginLeft: 10 }}>
                  {Math.round(trip.driver_eta_minutes)} minutes
                </span>
              ) : (
                <span style={{ marginLeft: 10 }}>Calculating...</span>
              )}
            </div>
                )}
          </>
        )}

      </div>
      {/* Timeline */}
      { trip && (trip.requestedAt || trip.createdAt || trip.startedAt || trip.completedAt || trip.cancelledAt) && (
      
        <div style={cardStyle}>

          <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 13 }}>
            Timeline
          </p>

          <div style={{ background: colors.bgDeep, borderRadius: 10 }}>

            {(trip.requestedAt || trip.createdAt) && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                <span>Requested</span>
                <span>{formatTime(trip.requestedAt || trip.createdAt)}</span>
              </div>
            )}

            {trip.assignedAt && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                <span>Driver Assigned</span>
                <span>{formatTime(trip.assignedAt)}</span>
              </div>
            )}

            {trip.startedAt && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                <span>Trip Started</span>
                <span>{formatTime(trip.startedAt)}</span>
              </div>
            )}

            {trip.completedAt && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                <span>Completed</span>
                <span>{formatTime(trip.completedAt)}</span>
              </div>
            )}

          </div>
        </div>
      )}

      {showCancelModal && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>
              Cancel your request?
            </h3>

            <p style={{ margin: "0 0 24px", fontSize: 14, color: colors.textMuted }}>
              {hasFee
                ? "A cancellation fee will apply because a driver has already been assigned."
                : "Your request will be removed and no driver will be matched."}
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: "transparent",
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  color: colors.textSecondary,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Keep Request
              </button>

              <button
                disabled={tripLoading}
                onClick={() => {
                  dispatch(cancelTrip(id));
                  setShowCancelModal(false);
                }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: colors.dangerDark,
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
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