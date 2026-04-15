import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { acceptTrip } from "../../../features/trips/tripsSlice";
import RoutePreviewMap from "../../../features/estimates/components/RoutePreviewMap";
import { cardStyle, sectionLabel } from "./driverDashboardStyles";
import { colors, alpha, gradients } from "../../../styles/theme";

export default function TripMarketplace() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const openTrips = useAppSelector((s) => s.trips.open || []);
  const tripLoading = useAppSelector((s) => s.trips.loading);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [detailsHovered, setDetailsHovered] = useState(false);

  const [sortBy, setSortBy] = useState("fare");
  const [maxDistance, setMaxDistance] = useState("");

  const processedTrips = useMemo(() => {
    let trips = [...openTrips];

    if (maxDistance) {
      trips = trips.filter((t) => t.distance_km <= Number(maxDistance));
    }

    if (sortBy === "fare") {
      trips.sort((a, b) => b.fare_amount - a.fare_amount);
    } else if (sortBy === "distance") {
      trips.sort((a, b) => a.distance_km - b.distance_km);
    } else if (sortBy === "profit") {
      trips.sort(
        (a, b) => b.fare_amount / (b.distance_km || 1) - a.fare_amount / (a.distance_km || 1),
      );
    }

    return trips;
  }, [openTrips, sortBy, maxDistance]);

  useEffect(() => {
    if (!selectedTrip && processedTrips.length) {
      setSelectedTrip(processedTrips[0]);
      return;
    }

    if (selectedTrip && processedTrips.length) {
      const stillThere = processedTrips.find((t) => t._id === selectedTrip._id);
      setSelectedTrip(stillThere || processedTrips[0] || null);
    }
  }, [processedTrips]);

  return (
    <div style={cardStyle}>
      <p style={sectionLabel}>
        Available Trips
        {processedTrips.length > 0 && (
          <span
            style={{
              marginLeft: 8,
              background: alpha.primary20,
              color: colors.primaryLight,
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 20,
            }}
          >
            {processedTrips.length}
          </span>
        )}
      </p>

      {/* FILTER + SORT (always visible) */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 14,
          background: colors.bgBase,
          padding: 8,
          borderRadius: 12,
          border: `1px solid ${colors.borderSubtle}`,
        }}
      >
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            background: colors.bgDeep,
            border: `1px solid ${colors.borderSubtle}`,
            color: colors.textPrimary,
            fontSize: 13,
            fontWeight: 500,
            outline: "none",
            cursor: "pointer",
          }}
          onFocus={(e) => (e.target.style.border = `1px solid ${alpha.primary50}`)}
          onBlur={(e) => (e.target.style.border = `1px solid ${colors.borderSubtle}`)}
        >
          <option value="fare">💰 Fare (High → Low)</option>
          <option value="distance">📍 Distance (Low → High)</option>
        </select>

        <select
          value={maxDistance}
          onChange={(e) => setMaxDistance(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            background: colors.bgDeep,
            border: `1px solid ${colors.borderSubtle}`,
            color: colors.textPrimary,
            fontSize: 13,
            fontWeight: 500,
            outline: "none",
            cursor: "pointer",
          }}
          onFocus={(e) => (e.target.style.border = `1px solid ${alpha.primary50}`)}
          onBlur={(e) => (e.target.style.border = `1px solid ${colors.borderSubtle}`)}
        >
          <option value="">🌍 All Distances</option>
          <option value="5">≤ 5 km</option>
          <option value="10">≤ 10 km</option>
          <option value="20">≤ 20 km</option>
        </select>
      </div>

      {processedTrips.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
          <p style={{ margin: 0, fontSize: 15, color: colors.textSecondary }}>
            No trips match your filters.
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: colors.textMuted }}>
            Try adjusting filters or check back later.
          </p>

          <button
            onClick={() => {
              setSortBy("fare");
              setMaxDistance("");
            }}
            style={{
              marginTop: 14,
              padding: "10px 16px",
              background: colors.bgBase,
              color: colors.textPrimary,
              border: `1px solid ${colors.borderSubtle}`,
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "340px 1fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          {/* Trip list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxHeight: 540,
              overflowY: "auto",
            }}
          >
            {processedTrips.map((t) => {
              const isSelected = selectedTrip?._id === t._id;
              return (
                <div
                  key={t._id}
                  onClick={() => setSelectedTrip(t)}
                  style={{
                    cursor: "pointer",
                    background: isSelected ? alpha.primary12 : colors.bgDeep,
                    border: isSelected
                      ? `1.5px solid ${alpha.primary50}`
                      : `1px solid ${colors.borderSubtle}`,
                    borderRadius: 12,
                    padding: "14px 16px",
                    boxShadow: isSelected ? "0 0 0 2px rgba(0,123,255,0.2)" : "none",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 700, color: colors.primary }}>
                      {t.fare_amount} {t.currency}
                    </span>
                    <span style={{ fontSize: 12, color: colors.textMuted }}>
                      {t.distance_km?.toFixed(2)} km
                    </span>
                  </div>

                  <div style={{ fontSize: 13, color: colors.textSecondary }}>
                    <span style={{ color: colors.textMuted }}>From </span>
                    {t.pickup_display_address || t.pickup_address || "—"}
                  </div>

                  <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12 }}>
                    <span style={{ color: colors.textMuted }}>To </span>
                    {t.dropoff_display_address || t.dropoff_address || "—"}
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

          {/* Map + details (unchanged) */}
          <div>
            {!selectedTrip ? (
              <div
                style={{
                  background: colors.bgDeep,
                  border: `1px dashed ${colors.border}`,
                  borderRadius: 12,
                  padding: "48px 20px",
                  textAlign: "center",
                  color: colors.textFaint,
                }}
              >
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

                <button
                  onClick={() => navigate(`/driver/trip/${selectedTrip._id}`)}
                  style={{
                    width: "100%",
                    padding: "11px 0",
                    background: alpha.primary15,
                    color: colors.primaryLight,
                    border: `1px solid ${alpha.primary40}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
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
