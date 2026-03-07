import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMyTrips } from "../../features/trips/tripsSlice";
import { Link, useNavigate } from "react-router-dom";
import { colors, alpha, pageStyle, cardStyle, tripStatusColors, errorBanner } from "../../styles/theme";

function StatusBadge({ status }) {
  const s = tripStatusColors[status] || { bg: alpha.neutral15, color: colors.textSecondary, label: status };
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
          style={{ background: "none", border: "none", color: colors.textSecondary, cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 16 }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Trip History</h2>
        <p style={{ margin: "6px 0 0", color: colors.textMuted, fontSize: 14 }}>All your past and active rides.</p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

        {/* Loading */}
        {status === "loading" && (
          <div style={{ ...cardStyle, color: colors.textMuted, fontSize: 14 }}>Loading…</div>
        )}

        {/* Error */}
        {error && (
          <div style={{ ...errorBanner, marginBottom: 16 }}>
            {String(error)}
          </div>
        )}

        {/* Empty state */}
        {trips.length === 0 && status !== "loading" && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "48px 20px", color: colors.textMuted }}>
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
                  <span style={{ fontSize: 12, color: colors.textMuted }}>
                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}
                  </span>
                </div>

                {(t.pickup_display_address || t.pickup_address) && (
                  <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: colors.textMuted }}>From </span>{t.pickup_display_address || t.pickup_address}
                  </div>
                )}
                {(t.dropoff_display_address || t.dropoff_address) && (
                  <div style={{ fontSize: 13, color: colors.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: colors.textMuted }}>To </span>{t.dropoff_display_address || t.dropoff_address}
                  </div>
                )}
              </div>

              <Link
                to={`/rider/trip/${t._id}`}
                style={{ flexShrink: 0, padding: "9px 18px", background: colors.border, color: colors.textPrimary, borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}
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
