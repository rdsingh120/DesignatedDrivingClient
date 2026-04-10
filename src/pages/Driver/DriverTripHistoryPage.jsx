// src/pages/Driver/DriverTripHistoryPage.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMyTrips } from "../../features/trips/tripsSlice";
import { colors, pageStyle, cardStyle, backBtn, tripStatusColors } from "../../styles/theme";
import DriverNavBar from "../../components/DriverNavBar";

export default function DriverTripHistoryPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const allTrips = useAppSelector((s) => s.trips.mine);
  const loading = useAppSelector((s) => s.trips.loading);

  useEffect(() => {
    dispatch(fetchMyTrips());
  }, [dispatch]);

  const completedTrips = allTrips.filter((t) => t.status === "COMPLETED");
  const totalEarnings = completedTrips.reduce((sum, t) => sum + (t.fare_amount || 0), 0);

  return (
    <div style={pageStyle}>
      <DriverNavBar />

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, padding: "0 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate("/driver")} style={backBtn}>
            ← Dashboard
          </button>
          <span style={{ color: colors.textFaint, fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, color: colors.textSecondary }}>Trip History</span>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: colors.textPrimary }}>Trip History</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: colors.textMuted }}>
            Your completed trips and earnings.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px 60px" }}>
        {loading ? (
          <div style={{ ...cardStyle, textAlign: "center", padding: "60px 24px" }}>
            <p style={{ margin: 0, color: colors.textMuted, fontSize: 15 }}>Loading trips…</p>
          </div>
        ) : completedTrips.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚗</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>No completed trips yet</h3>
            <p style={{ margin: 0, color: colors.textMuted, fontSize: 14 }}>
              Complete trips to see your history and earnings here.
            </p>
          </div>
        ) : (
          <>
            {/* ── Earnings summary ── */}
            <div style={{
              ...cardStyle,
              display: "flex",
              gap: 0,
              overflow: "hidden",
              padding: 0,
              marginBottom: 24,
            }}>
              <div style={{
                flex: 1,
                padding: "24px 28px",
                borderRight: `1px solid ${colors.border}`,
                textAlign: "center",
              }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  Trips Completed
                </p>
                <p style={{ margin: 0, fontSize: 40, fontWeight: 800, color: colors.textPrimary, lineHeight: 1.1 }}>
                  {completedTrips.length}
                </p>
              </div>
              <div style={{ flex: 1, padding: "24px 28px", textAlign: "center" }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  Total Earned
                </p>
                <p style={{ margin: 0, fontSize: 40, fontWeight: 800, color: colors.successLight, lineHeight: 1.1 }}>
                  ${totalEarnings.toFixed(2)}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: colors.textFaint }}>CAD</p>
              </div>
            </div>

            {/* ── Trip list ── */}
            <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Completed Trips
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {completedTrips.map((trip) => {
                const pickup = trip.pickup_display_address || trip.pickup_address || "—";
                const dropoff = trip.dropoff_display_address || trip.dropoff_address || "—";
                const date = trip.completedAt
                  ? new Date(trip.completedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
                  : trip.createdAt
                    ? new Date(trip.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
                    : "—";
                const duration = trip.duration_minutes ? `${Math.round(trip.duration_minutes)} min` : null;
                const distance = trip.distance_km ? `${trip.distance_km.toFixed(1)} km` : null;
                const statusMeta = tripStatusColors["COMPLETED"];

                return (
                  <div
                    key={trip._id}
                    style={{
                      ...cardStyle,
                      marginBottom: 0,
                      cursor: "pointer",
                      transition: "border-color 0.15s",
                    }}
                    onClick={() => navigate(`/driver/trip/${trip._id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.primary}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.border}
                  >
                    {/* Top row: date + fare + status */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 8 }}>
                      <span style={{ fontSize: 13, color: colors.textMuted }}>{date}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: colors.successLight }}>
                          +${(trip.fare_amount || 0).toFixed(2)} CAD
                        </span>
                        <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: statusMeta.bg, color: statusMeta.color }}>
                          {statusMeta.label}
                        </span>
                      </div>
                    </div>

                    {/* Route */}
                    <div style={{ display: "flex", gap: 12 }}>
                      {/* Connector */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 3, flexShrink: 0 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${colors.primary}`, background: "transparent" }} />
                        <div style={{ width: 2, flex: 1, background: colors.border, margin: "3px 0" }} />
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: colors.successLight }} />
                      </div>
                      {/* Addresses */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                        <span style={{ fontSize: 13, color: colors.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pickup}</span>
                        <span style={{ fontSize: 13, color: colors.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dropoff}</span>
                      </div>
                    </div>

                    {/* Meta: distance + duration */}
                    {(duration || distance) && (
                      <div style={{ marginTop: 10, display: "flex", gap: 14 }}>
                        {distance && <span style={{ fontSize: 12, color: colors.textFaint }}>{distance}</span>}
                        {duration && <span style={{ fontSize: 12, color: colors.textFaint }}>{duration}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
