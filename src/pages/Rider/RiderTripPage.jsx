import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useTripPolling } from "../../hooks/useTripPolling";
import { colors, pageStyle, cardStyle } from "../../styles/theme";

import RoutePreviewMap from "../../features/estimates/components/RoutePreviewMap";
import StatusBadge from "./components/StatusBadge";
import StatusTracker from "./components/StatusTracker";

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
          style={{ background: "none", border: "none", color: colors.textSecondary, cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 16 }}
        >
          ← Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Your Trip</h2>
          {trip && <StatusBadge status={trip.status} />}
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: colors.textFaint, fontFamily: "monospace" }}>{id}</p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

        {!trip ? (
          <div style={{ ...cardStyle, color: colors.textMuted, fontSize: 14 }}>Loading trip…</div>
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
          </>
        )}

      </div>
    </div>
  );
}
