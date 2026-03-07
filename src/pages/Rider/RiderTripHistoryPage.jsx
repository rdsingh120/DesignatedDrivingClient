import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMyTrips } from "../../features/trips/tripsSlice";
import { Link, useNavigate } from "react-router-dom";

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
};

function StatusBadge({ status }) {
  const map = {
    OPEN:      { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa",  label: "Open" },
    ASSIGNED:  { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24",  label: "Assigned" },
    ENROUTE:   { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24",  label: "En Route" },
    DRIVING:   { bg: "rgba(99,102,241,0.15)",  color: "#818cf8",  label: "Driving" },
    COMPLETED: { bg: "rgba(16,185,129,0.15)",  color: "#34d399",  label: "Completed" },
    CANCELLED: { bg: "rgba(239,68,68,0.15)",   color: "#f87171",  label: "Cancelled" },
  };
  const s = map[status] || { bg: "rgba(100,116,139,0.15)", color: "#94a3b8", label: status };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.04em" }}>
      {s.label}
    </span>
  );
}

export default function RiderTripHistoryPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const trips = useAppSelector((s) => s.trips.mine || []);
  const status = useAppSelector((s) => s.trips.status);
  const error = useAppSelector((s) => s.trips.error);

  useEffect(() => {
    dispatch(fetchMyTrips());
  }, [dispatch]);

  return (
    <div style={pageStyle}>

      {/* Header */}
      <div style={{ padding: "20px 24px 0", marginBottom: 28 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 16 }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Trip History</h2>
        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 14 }}>All your past and active rides.</p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

        {/* Loading */}
        {status === "loading" && (
          <div style={{ ...cardStyle, color: "#64748b", fontSize: 14 }}>Loading…</div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#450a0a", border: "1px solid #991b1b", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 14, color: "#fca5a5" }}>
            {String(error)}
          </div>
        )}

        {/* Empty state */}
        {trips.length === 0 && status !== "loading" && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "48px 20px", color: "#64748b" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🚗</div>
            <p style={{ margin: 0, fontSize: 15 }}>No trips yet.</p>
            <p style={{ margin: "6px 0 0", fontSize: 13 }}>Book your first ride to see history here.</p>
          </div>
        )}

        {/* Trip list */}
        <div style={{ display: "grid", gap: 12 }}>
          {trips.map((t) => (
            <div key={t._id} style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <StatusBadge status={t.status} />
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}
                  </span>
                </div>

                {(t.pickup_display_address || t.pickup_address) && (
                  <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: "#64748b" }}>From </span>{t.pickup_display_address || t.pickup_address}
                  </div>
                )}
                {(t.dropoff_display_address || t.dropoff_address) && (
                  <div style={{ fontSize: 13, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: "#64748b" }}>To </span>{t.dropoff_display_address || t.dropoff_address}
                  </div>
                )}
              </div>

              <Link
                to={`/rider/trip/${t._id}`}
                style={{ flexShrink: 0, padding: "9px 18px", background: "#334155", color: "#f1f5f9", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}
              >
                View →
              </Link>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
