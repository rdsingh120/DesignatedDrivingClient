import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { acceptTrip } from "../../../features/trips/tripsSlice";
import RoutePreviewMap from "../../../features/estimates/components/RoutePreviewMap";
import { cardStyle, sectionLabel } from "./driverDashboardStyles";
import { colors, alpha, gradients } from "../../../styles/theme";

export default function TripMarketplace() {
  const dispatch = useAppDispatch();
  const openTrips = useAppSelector((s) => s.trips.open || []);
  const tripLoading = useAppSelector((s) => s.trips.loading);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [detailsHovered, setDetailsHovered] = useState(false);

  useEffect(() => {
    if (!selectedTrip && openTrips.length) {
      setSelectedTrip(openTrips[0]);
      return;
    }
    if (selectedTrip && openTrips.length) {
      const stillThere = openTrips.find((t) => t._id === selectedTrip._id);
      setSelectedTrip(stillThere || openTrips[0] || null);
    }
  }, [openTrips]);

  return (
    <div style={cardStyle}>
      <p style={sectionLabel}>
        Available Trips
        {openTrips.length > 0 && (
          <span style={{ marginLeft: 8, background: alpha.primary20, color: colors.primaryLight, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
            {openTrips.length}
          </span>
        )}
      </p>

      {openTrips.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
          <p style={{ margin: 0, fontSize: 15, color: colors.textSecondary }}>No open trips right now.</p>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: colors.textMuted }}>Check back soon — new trips are posted frequently.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 16, alignItems: "start" }}>

          {/* Trip list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 540, overflowY: "auto" }}>
            {openTrips.map((t) => {
              const isSelected = selectedTrip?._id === t._id;
              return (
                <div
                  key={t._id}
                  onClick={() => setSelectedTrip(t)}
                  style={{
                    cursor: "pointer",
                    background: isSelected ? alpha.primary12 : colors.bgDeep,
                    border: isSelected ? `1.5px solid ${alpha.primary50}` : `1px solid ${colors.borderSubtle}`,
                    borderRadius: 12,
                    padding: "14px 16px",
                    transition: "border 0.15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: colors.primary }}>{t.fare_amount} {t.currency}</span>
                    <span style={{ fontSize: 12, color: colors.textMuted }}>{t.distance_km} km</span>
                  </div>
                  <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <span style={{ color: colors.textMuted }}>From </span>{t.pickup_display_address || t.pickup_address || "—"}
                  </div>
                  <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <span style={{ color: colors.textMuted }}>To </span>{t.dropoff_display_address || t.dropoff_address || "—"}
                  </div>
                  <button
                    disabled={tripLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(acceptTrip(t._id));
                    }}
                    style={{
                      width: "100%",
                      padding: "9px 0",
                      background: isSelected ? gradients.primary : colors.bgBase,
                      color: isSelected ? "#fff" : colors.textSecondary,
                      border: isSelected ? "none" : `1px solid ${colors.border}`,
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 13,
                      opacity: tripLoading ? 0.6 : 1,
                    }}
                  >
                    Accept Trip
                  </button>
                </div>
              );
            })}
          </div>

          {/* Map preview */}
          <div>
            {!selectedTrip ? (
              <div style={{ background: colors.bgDeep, border: `1px dashed ${colors.border}`, borderRadius: 12, padding: "48px 20px", textAlign: "center", color: colors.textFaint, fontSize: 14 }}>
                Select a trip to preview the route
              </div>
            ) : (
              <>
                <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                  <RoutePreviewMap
                    key={selectedTrip._id}
                    pickup={selectedTrip.pickup_geo}
                    dropoff={selectedTrip.dropoff_geo}
                    route_polyline={selectedTrip.route_polyline}
                    height={420}
                  />
                </div>
                <div style={{ background: colors.bgDeep, borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.borderSubtle}` }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Pickup</p>
                    <p style={{ margin: 0, fontSize: 14, color: colors.textPrimary }}>{selectedTrip.pickup_display_address || selectedTrip.pickup_address}</p>
                  </div>
                  <div style={{ padding: "12px 16px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Dropoff</p>
                    <p style={{ margin: 0, fontSize: 14, color: colors.textPrimary }}>{selectedTrip.dropoff_display_address || selectedTrip.dropoff_address}</p>
                  </div>
                </div>
                {/* TODO: implement trip details view */}
                <button
                  onClick={() => {}}
                  onMouseEnter={() => setDetailsHovered(true)}
                  onMouseLeave={() => setDetailsHovered(false)}
                  style={{
                    width: "100%",
                    padding: "11px 0",
                    background: detailsHovered ? alpha.primary30 : alpha.primary15,
                    color: detailsHovered ? colors.primaryFaint : colors.primaryLight,
                    border: `1px solid ${detailsHovered ? alpha.primary70 : alpha.primary40}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                    transition: "all 0.15s",
                  }}
                >
                  View Trip Details →
                </button>
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
