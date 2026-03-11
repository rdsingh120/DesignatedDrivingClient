import { useState, useEffect } from "react";
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

// Steps for the progress tracker
const STEPS = ["Heading to Pickup", "Arrived", "Driving", "Completed"];
const STATUS_TO_STEP = { ASSIGNED: 0, ENROUTE: 1, DRIVING: 2, COMPLETED: 3 };

// 5-minute no-show threshold
const NO_SHOW_SECONDS = 5 * 60;

export default function ActiveTripCard() {
  const dispatch = useAppDispatch();
  const trip = useAppSelector((s) => s.trips.current);
  const tripLoading = useAppSelector((s) => s.trips.loading);
  const [cancelMode, setCancelMode] = useState(null);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [noShowFired, setNoShowFired] = useState(false);

  const tripId = trip?._id;
  const status = trip?.status;
  const canCancel = status === "ASSIGNED" || status === "ENROUTE";
  const currentStep = STATUS_TO_STEP[status] ?? -1;

  // Wait timer — ticks every second when driver is waiting at pickup
  const waitStart = trip?.arrivedAt || trip?.updatedAt;
  useEffect(() => {
    if (status !== "ENROUTE" || !waitStart) return;
    const tick = () => {
      const diff = Math.floor((Date.now() - new Date(waitStart).getTime()) / 1000);
      setWaitSeconds(Math.max(0, diff));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [status, waitStart]);

  // Auto-trigger no-show modal at 5 minutes
  useEffect(() => {
    if (waitSeconds >= NO_SHOW_SECONDS && !noShowFired) {
      setNoShowFired(true);
      setCancelMode("noshow");
    }
  }, [waitSeconds, noShowFired]);

  if (!trip) {
    return (
      <div style={cardStyle}>
        <p style={sectionLabel}>Active Trip</p>
        <p style={{ margin: 0, color: colors.textMuted, fontSize: 14 }}>Loading trip…</p>
      </div>
    );
  }

  // Format wait time as M:SS
  const waitMinutes = Math.floor(waitSeconds / 60);
  const waitSecs = waitSeconds % 60;
  const waitDisplay = `${waitMinutes}:${String(waitSecs).padStart(2, "0")}`;
  const isOverdue = waitSeconds >= NO_SHOW_SECONDS;

  // Status banner info
  const bannerInfo = TRIP_STATUS_INFO[status];

  return (
    <div style={cardStyle}>
      <p style={sectionLabel}>Active Trip</p>

      {/* Step progress tracker */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        {STEPS.map((label, i) => {
          const isPast = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{
                  width: isCurrent ? 22 : 18,
                  height: isCurrent ? 22 : 18,
                  borderRadius: "50%",
                  background: isPast ? colors.success : isCurrent ? colors.primary : colors.textFaint,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: "#fff", fontWeight: 700,
                }}>
                  {isPast ? "✓" : i + 1}
                </div>
                <span style={{
                  fontSize: 10,
                  marginTop: 4,
                  textAlign: "center",
                  fontWeight: isCurrent ? 600 : 400,
                  color: isCurrent ? colors.textPrimary : isPast ? colors.textMuted : colors.textFaint,
                }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  height: 2, flex: 1, minWidth: 12,
                  background: isPast ? colors.success : colors.textFaint,
                  opacity: isPast ? 0.6 : 0.3,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Status banner */}
      {bannerInfo && (
        <div style={{
          background: bannerInfo.bg,
          border: `1px solid ${bannerInfo.border}`,
          borderRadius: 12,
          padding: "14px 18px",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 26 }}>{bannerInfo.icon}</span>
          <div>
            <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15, color: bannerInfo.color }}>
              {bannerInfo.title}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: colors.textSecondary }}>
              {bannerInfo.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* Wait timer — visible when driver has arrived at pickup */}
      {status === "ENROUTE" && (
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 14px", borderRadius: 8,
            background: isOverdue ? alpha.warning10 : alpha.info10,
            border: `1px solid ${isOverdue ? alpha.warning25 : alpha.info25}`,
          }}>
            <span style={{ fontSize: 14 }}>⏱</span>
            <span style={{
              fontSize: 13, fontWeight: 600,
              color: isOverdue ? colors.warningLight : colors.infoLight,
            }}>
              {isOverdue
                ? `Rider has exceeded the 5-minute wait time (${waitDisplay})`
                : `Waiting for rider: ${waitDisplay} — auto-cancels at 5:00`}
            </span>
          </div>
        </div>
      )}

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
          <p style={{ margin: 0, fontSize: 14, color: colors.textPrimary }}>
            {trip.pickup_display_address || trip.pickup_address || "—"}
          </p>
        </div>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Dropoff</p>
          <p style={{ margin: 0, fontSize: 14, color: colors.textPrimary }}>
            {trip.dropoff_display_address || trip.dropoff_address || "—"}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
          <span style={{ fontSize: 13, color: colors.textMuted }}>Fare</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: colors.primary }}>
            {trip.fare_amount} {trip.currency}
          </span>
        </div>
      </div>

      {/* Action buttons — color-coded by status */}
      <div style={{ display: "flex", gap: 10 }}>
        {status === "ASSIGNED" && (
          <button
            disabled={tripLoading}
            onClick={() => dispatch(arriveTrip(tripId))}
            style={{
              flex: 1, padding: "12px 0", border: "none", borderRadius: 8,
              color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
              background: `linear-gradient(135deg, ${colors.info}, #2563eb)`,
              opacity: tripLoading ? 0.6 : 1,
            }}
          >
            I've Arrived at Pickup
          </button>
        )}
        {status === "ENROUTE" && (
          <button
            disabled={tripLoading}
            onClick={() => dispatch(startTrip(tripId))}
            style={{
              flex: 1, padding: "12px 0", border: "none", borderRadius: 8,
              color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
              background: gradients.success,
              opacity: tripLoading ? 0.6 : 1,
            }}
          >
            Start Trip
          </button>
        )}
        {status === "DRIVING" && (
          <button
            disabled={tripLoading}
            onClick={() => dispatch(completeTrip(tripId))}
            style={{
              flex: 1, padding: "12px 0", border: "none", borderRadius: 8,
              color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
              background: `linear-gradient(135deg, ${colors.dangerDark}, #b91c1c)`,
              opacity: tripLoading ? 0.6 : 1,
            }}
          >
            Complete Trip
          </button>
        )}
        {canCancel && (
          <button
            disabled={tripLoading}
            onClick={() => setCancelMode("manual")}
            style={{
              padding: "12px 18px", background: "transparent", borderRadius: 8,
              color: colors.dangerLight, border: `1px solid ${colors.dangerDeep}`,
              cursor: "pointer", fontWeight: 600, fontSize: 14,
              opacity: tripLoading ? 0.6 : 1,
            }}
          >
            Cancel Trip
          </button>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {cancelMode && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>
              {cancelMode === "noshow" ? "Rider no-show?" : "Cancel this trip?"}
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: colors.textMuted, lineHeight: 1.5 }}>
              {cancelMode === "noshow"
                ? "The rider has exceeded the 5-minute wait time. You can cancel without penalty."
                : "Are you sure? The rider will be notified and the trip returns to the marketplace."}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setCancelMode(null)}
                style={{
                  flex: 1, padding: "10px 0", background: "transparent",
                  border: `1px solid ${colors.border}`, borderRadius: 8,
                  color: colors.textSecondary, cursor: "pointer", fontWeight: 600, fontSize: 14,
                }}
              >
                Keep Waiting
              </button>
              <button
                disabled={tripLoading}
                onClick={() => { dispatch(cancelTrip(tripId)); setCancelMode(null); }}
                style={{
                  flex: 1, padding: "10px 0", border: "none", borderRadius: 8,
                  cursor: "pointer", fontWeight: 600, fontSize: 14,
                  background: cancelMode === "noshow" ? colors.warning : colors.dangerDark,
                  color: cancelMode === "noshow" ? "#000" : "#fff",
                  opacity: tripLoading ? 0.6 : 1,
                }}
              >
                {cancelMode === "noshow" ? "Cancel — No-Show" : "Yes, Cancel Trip"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
