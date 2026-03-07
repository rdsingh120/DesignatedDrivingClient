import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useTripPolling } from "../../hooks/useTripPolling";

import RoutePreviewMap from "../../features/estimates/components/RoutePreviewMap";

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  color: "#f1f5f9",
  fontFamily: "system-ui, sans-serif",
  padding: "0 0 60px",
};

const cardStyle = {
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: 16,
  padding: 20,
  marginBottom: 16,
};

// Ordered steps shown in the tracker
const STEPS = ["REQUESTED", "ASSIGNED", "ENROUTE", "DRIVING", "COMPLETED"];

const STEP_LABELS = {
  REQUESTED: "Requested",
  ASSIGNED:  "Driver Assigned",
  ENROUTE:   "Driver En Route",
  DRIVING:   "In Progress",
  COMPLETED: "Completed",
};

// Friendly status message shown in the banner
const STATUS_INFO = {
  REQUESTED: {
    icon: "🔍",
    title: "Looking for a driver...",
    subtitle: "Hang tight! We're finding a designated driver near you.",
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.25)",
  },
  ASSIGNED: {
    icon: "🚗",
    title: "Driver assigned!",
    subtitle: "Your driver has accepted the trip and is heading to your pickup location.",
    color: "#fbbf24",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  ENROUTE: {
    icon: "📍",
    title: "Driver is on the way",
    subtitle: "Your driver is heading to your pickup location. Please be ready!",
    color: "#fbbf24",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  DRIVING: {
    icon: "🛣️",
    title: "You're on your way!",
    subtitle: "Sit back and relax — your driver is taking you to your destination.",
    color: "#818cf8",
    bg: "rgba(99,102,241,0.1)",
    border: "rgba(99,102,241,0.25)",
  },
  COMPLETED: {
    icon: "✅",
    title: "You've arrived!",
    subtitle: "Trip completed. Thanks for using Designated Driving.",
    color: "#34d399",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
  },
  CANCELLED: {
    icon: "❌",
    title: "Trip cancelled",
    subtitle: "This trip was cancelled.",
    color: "#f87171",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
  },
};

function StatusBadge({ status }) {
  const map = {
    REQUESTED: { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa",  label: "Requested" },
    OPEN:      { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa",  label: "Open" },
    ASSIGNED:  { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24",  label: "Assigned" },
    ENROUTE:   { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24",  label: "En Route" },
    DRIVING:   { bg: "rgba(99,102,241,0.15)",  color: "#818cf8",  label: "In Progress" },
    COMPLETED: { bg: "rgba(16,185,129,0.15)",  color: "#34d399",  label: "Completed" },
    CANCELLED: { bg: "rgba(239,68,68,0.15)",   color: "#f87171",  label: "Cancelled" },
  };
  const s = map[status] || { bg: "rgba(100,116,139,0.15)", color: "#94a3b8", label: status };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>
      {s.label}
    </span>
  );
}

function StatusTracker({ status }) {
  const info = STATUS_INFO[status] || STATUS_INFO["REQUESTED"];
  const currentIdx = STEPS.indexOf(status);

  return (
    <>
      {/* Status banner */}
      <div style={{ ...cardStyle, background: info.bg, border: `1px solid ${info.border}`, display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ fontSize: 28, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>{info.icon}</div>
        <div>
          <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 16, color: info.color }}>{info.title}</p>
          <p style={{ margin: 0, fontSize: 14, color: "#94a3b8", lineHeight: 1.5 }}>{info.subtitle}</p>
        </div>
      </div>

      {/* Step progress — only for non-cancelled trips */}
      {status !== "CANCELLED" && (
        <div style={{ ...cardStyle, padding: "20px 24px" }}>
          <p style={{ margin: "0 0 16px", fontWeight: 600, fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Trip Progress</p>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {STEPS.map((step, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              const isLast = i === STEPS.length - 1;
              const dotColor = done || active ? (active ? info.color : "#34d399") : "#334155";
              const lineColor = done ? "#34d399" : "#334155";
              return (
                <div key={step} style={{ display: "flex", alignItems: "center", flex: isLast ? "none" : 1, minWidth: 0 }}>
                  {/* Dot + label */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <div style={{
                      width: active ? 14 : 10,
                      height: active ? 14 : 10,
                      borderRadius: "50%",
                      background: dotColor,
                      boxShadow: active ? `0 0 0 3px ${info.bg}, 0 0 0 5px ${info.border}` : "none",
                      transition: "all 0.3s",
                    }} />
                    <span style={{ fontSize: 10, color: active ? info.color : done ? "#34d399" : "#475569", fontWeight: active ? 700 : 400, whiteSpace: "nowrap", maxWidth: 64, textAlign: "center", lineHeight: 1.2 }}>
                      {STEP_LABELS[step]}
                    </span>
                  </div>
                  {/* Connector line */}
                  {!isLast && (
                    <div style={{ flex: 1, height: 2, background: lineColor, marginBottom: 22, transition: "background 0.3s" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default function RiderTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  useTripPolling(id, {
    enabled: true,
    intervalMs: 2500,
    stopOn: ["COMPLETED"],
  });

  const trip = useAppSelector((s) => s.trips.current);

  const driverName = trip?.driverProfile?.user?.name;

  return (
    <div style={pageStyle}>

      {/* Header */}
      <div style={{ padding: "20px 24px 0", marginBottom: 24 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 16 }}
        >
          ← Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Your Trip</h2>
          {trip && <StatusBadge status={trip.status} />}
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "#475569", fontFamily: "monospace" }}>{id}</p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

        {!trip ? (
          <div style={{ ...cardStyle, color: "#64748b", fontSize: 14 }}>Loading trip…</div>
        ) : (
          <>
            {/* Real-time status tracker */}
            <StatusTracker status={trip.status} />

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
              <span style={{ fontSize: 14, color: "#64748b" }}>Fare</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#6366f1" }}>
                {trip.fare_amount} {trip.currency}
              </span>
            </div>

            {/* Route */}
            <div style={cardStyle}>
              <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Route</p>
              <div style={{ background: "#0f172a", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "#64748b" }}>Pickup</p>
                  <p style={{ margin: 0, fontSize: 14, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{trip.pickup_display_address || trip.pickup_address}</p>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "#64748b" }}>Dropoff</p>
                  <p style={{ margin: 0, fontSize: 14, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{trip.dropoff_display_address || trip.dropoff_address}</p>
                </div>
              </div>
            </div>

            {/* People & vehicle */}
            <div style={cardStyle}>
              <p style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Details</p>
              <div style={{ background: "#0f172a", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>Rider</span>
                  <span style={{ fontSize: 14, color: "#f1f5f9" }}>{trip.rider?.name || trip.rider?._id || "—"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #1e293b" }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>Driver</span>
                  {driverName ? (
                    <span style={{ fontSize: 14, color: "#f1f5f9" }}>{driverName}</span>
                  ) : (
                    <span style={{ fontSize: 13, color: "#60a5fa", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                      Waiting for a driver...
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px" }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>Vehicle</span>
                  <span style={{ fontSize: 14, color: "#f1f5f9" }}>
                    {trip.vehicle?.make} {trip.vehicle?.model} ({trip.vehicle?.plateNumber})
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
