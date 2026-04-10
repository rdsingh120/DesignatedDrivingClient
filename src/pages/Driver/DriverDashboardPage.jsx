// src/pages/Driver/DriverDashboardPage.jsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useTripPolling } from "../../hooks/useTripPolling";
import { getMyDriverProfile } from "../../features/driver/driverProfilesSlice";
import { fetchTripById, fetchOpenTrips } from "../../features/trips/tripsSlice";
import { colors, alpha, gradients } from "../../styles/theme";
import DriverNavBar from "../../components/DriverNavBar";

import DriverStatusCard from "./components/DriverStatusCard";
import ActiveTripCard from "./components/ActiveTripCard";
import TripMarketplace from "./components/TripMarketplace";
import { Navigate } from "react-router-dom";
import { apiUpdateMyDriverLocation  } from "../../api/driverClient";

export default function DriverDashboardPage() {
  const dispatch = useAppDispatch();
  const driverProfile = useAppSelector((s) => s.driverProfiles.me);
  const activeTripId = driverProfile?.activeTrip || null;
  const isAvailable = driverProfile?.availability === "AVAILABLE";
  const isVerified = driverProfile?.verificationStatus === "VERIFIED";

  useTripPolling(activeTripId);

  useEffect(() => {
    dispatch(getMyDriverProfile());
  }, [dispatch]);

  useEffect(() => {
    if (activeTripId) {
      dispatch(fetchTripById(activeTripId));
    }
  }, [dispatch, activeTripId]);

  useEffect(() => {
    if (isAvailable && !activeTripId) {
      dispatch(fetchOpenTrips());
    }
  }, [dispatch, isAvailable, activeTripId]);

  //
  useEffect(() => {
  if (!navigator.geolocation || !driverProfile) return;

  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      apiUpdateMyDriverLocation({ lat, lng }).catch(console.error);
    },
    (err) => {
      console.error("GPS error:", err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}, [driverProfile]);
  //

  const canShowMarketplace = !activeTripId && isAvailable && isVerified;

  if (driverProfile && !driverProfile.licenseNumber) {
    return <Navigate to="/driver/profile" replace />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: gradients.page,
        color: colors.textPrimary,
        fontFamily: "system-ui, sans-serif",
        padding: "0 0 60px",
      }}
    >
      <DriverNavBar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 0" }}>
        <DriverStatusCard />

        {/* Quick actions (only if profile complete) */}
        {driverProfile?.licenseNumber && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <a href="/driver/profile" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: colors.bgBase,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 16,
                  padding: 24,
                  cursor: "pointer",
                  transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = colors.primary;
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: alpha.primary15,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    fontSize: 20,
                  }}
                >
                  👤
                </div>

                <h2
                  style={{
                    margin: "0 0 6px",
                    fontSize: 18,
                    fontWeight: 700,
                    color: colors.textPrimary,
                  }}
                >
                  Update Profile
                </h2>

                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: colors.textMuted,
                  }}
                >
                  Update your driver information and documents
                </p>
              </div>
            </a>
          </div>
        )}

        {/* Not verified warning */}
        {driverProfile && !isVerified && (
          <div
            style={{
              background: alpha.warning08,
              border: `1px solid ${alpha.warning25}`,
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 16,
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 20, flexShrink: 0 }}>⏳</span>
            <div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontWeight: 700,
                  fontSize: 14,
                  color: colors.warningLight,
                }}
              >
                Awaiting verification
              </p>
              <p style={{ margin: 0, fontSize: 13, color: colors.textSecondary, lineHeight: 1.5 }}>
                Your driver profile is under review. You'll be able to accept trips once verified by
                an admin.
              </p>
            </div>
          </div>
        )}

        {/* Offline empty state */}
        {!activeTripId && !isAvailable && driverProfile && isVerified && (
          <div
            style={{
              background: colors.bgBase,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              marginBottom: 16,
              textAlign: "center",
              padding: "48px 20px",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>😴</div>
            <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700 }}>You're offline</p>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>
              Use the toggle above to go online and start accepting trips.
            </p>
          </div>
        )}

        {activeTripId && <ActiveTripCard />}

        {canShowMarketplace && <TripMarketplace />}
      </div>
    </div>
  );
}
