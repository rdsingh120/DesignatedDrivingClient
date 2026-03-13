import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchTripById, acceptTrip } from "../../features/trips/tripsSlice";
import RoutePreviewMap from "../../features/estimates/components/RoutePreviewMap";
import { colors, alpha, gradients, btn, cardStyle, tripStatusColors } from "../../styles/theme";

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${colors.borderSubtle}` }}>
      <span style={{ fontSize: 13, color: colors.textMuted }}>{label}</span>
      <span style={{ fontSize: 14, color: colors.textPrimary, fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value ?? "—"}</span>
    </div>
  );
}

export default function DriverTripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const trip = useAppSelector((s) => s.trips.current);
  const loading = useAppSelector((s) => s.trips.loading);
  const error = useAppSelector((s) => s.trips.error);

  const [accepting, setAccepting] = useState(false);
  const [backHovered, setBackHovered] = useState(false);
  const [acceptHovered, setAcceptHovered] = useState(false);

  useEffect(() => {
    dispatch(fetchTripById(id));
  }, [id]);

  async function handleAccept() {
    setAccepting(true);
    const result = await dispatch(acceptTrip(id));
    if (acceptTrip.fulfilled.match(result)) {
      navigate("/driver", { replace: true });
    } else {
      setAccepting(false);
    }
  }

  const statusInfo = trip?.status ? tripStatusColors[trip.status] : null;

  return (
    <div style={{ minHeight: "100vh", background: gradients.page, color: colors.textPrimary, fontFamily: "system-ui, sans-serif", padding: "0 0 60px" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${colors.borderSubtle}`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => navigate("/driver")}
          onMouseEnter={() => setBackHovered(true)}
          onMouseLeave={() => setBackHovered(false)}
          style={{
            ...btn.ghost,
            padding: "8px 14px",
            fontSize: 13,
            background: backHovered ? alpha.neutral15 : "transparent",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ← Back
        </button>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Trip Details</h1>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 0" }}>

        {/* Loading */}
        {loading && !trip && (
          <div style={{ textAlign: "center", padding: "60px 0", color: colors.textMuted, fontSize: 15 }}>
            Loading trip details…
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#450a0a", border: `1px solid #991b1b`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#fca5a5" }}>
            {error}
          </div>
        )}

        {trip && trip._id === id && (
          <>
            {/* Fare + status row */}
            <div style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 13, color: colors.textMuted }}>Fare</p>
                <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: colors.primary }}>
                  {trip.fare_amount} <span style={{ fontSize: 16, fontWeight: 600 }}>{trip.currency}</span>
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                {statusInfo && (
                  <span style={{ background: statusInfo.bg, color: statusInfo.color, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {statusInfo.label}
                  </span>
                )}
                <span style={{ fontSize: 13, color: colors.textMuted }}>{trip.distance_km} km &nbsp;·&nbsp; ~{trip.duration_min} min</span>
              </div>
            </div>

            {/* Map */}
            <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
              <RoutePreviewMap
                key={trip._id}
                pickup={trip.pickup_geo}
                dropoff={trip.dropoff_geo}
                route_polyline={trip.route_polyline}
                height={340}
              />
            </div>

            {/* Trip info */}
            <div style={cardStyle}>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Route</p>
              <DetailRow label="Pickup" value={trip.pickup_display_address || trip.pickup_address} />
              <DetailRow label="Dropoff" value={trip.dropoff_display_address || trip.dropoff_address} />
              <DetailRow label="Distance" value={trip.distance_km ? `${trip.distance_km} km` : null} />
              <DetailRow label="Est. Duration" value={trip.duration_min ? `${trip.duration_min} min` : null} />
            </div>

            <div style={cardStyle}>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Payment</p>
              <DetailRow label="Fare" value={trip.fare_amount ? `${trip.fare_amount} ${trip.currency}` : null} />
              <DetailRow label="Payment Method" value={trip.payment_method} />
              <DetailRow label="Payment Status" value={trip.payment_status} />
            </div>

            {/* Accept / Back buttons */}
            {trip.status === "REQUESTED" && (
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  onClick={() => navigate("/driver")}
                  style={{ ...btn.ghost, flex: 1, padding: "13px 0", fontSize: 15, textAlign: "center" }}
                >
                  Go Back
                </button>
                <button
                  disabled={accepting || loading}
                  onClick={handleAccept}
                  onMouseEnter={() => setAcceptHovered(true)}
                  onMouseLeave={() => setAcceptHovered(false)}
                  style={{
                    flex: 2,
                    padding: "13px 0",
                    background: acceptHovered ? `linear-gradient(135deg, #4338ca, #6d28d9)` : gradients.primary,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: accepting || loading ? "not-allowed" : "pointer",
                    fontWeight: 700,
                    fontSize: 15,
                    opacity: accepting || loading ? 0.65 : 1,
                    transition: "background 0.15s",
                  }}
                >
                  {accepting ? "Accepting…" : "Accept Trip"}
                </button>
              </div>
            )}

            {trip.status !== "REQUESTED" && (
              <button
                onClick={() => navigate("/driver")}
                style={{ ...btn.ghost, width: "100%", padding: "13px 0", fontSize: 15, marginTop: 8 }}
              >
                ← Back to Dashboard
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
