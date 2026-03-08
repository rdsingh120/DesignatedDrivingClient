// src/pages/Driver/DriverDashboardPage.jsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useTripPolling } from "../../hooks/useTripPolling";
import { logout, selectUser } from "../../features/auth/authSlice";
import { getMyDriverProfile, updateMyDriverStatus } from "../../features/driver/driverProfilesSlice";
import { fetchTripById, fetchOpenTrips } from "../../features/trips/tripsSlice";
import { colors, alpha, gradients } from "../../styles/theme";

import DriverStatusCard from "./components/DriverStatusCard";
import ActiveTripCard from "./components/ActiveTripCard";
import TripMarketplace from "./components/TripMarketplace";

export default function DriverDashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
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

  const canShowMarketplace = !activeTripId && isAvailable && isVerified;

  async function handleSignOut() {
    if (isAvailable) {
      await dispatch(updateMyDriverStatus({ availability: "OFFLINE" }));
    }
    dispatch(logout());
  }

  return (
    <div style={{ minHeight: "100vh", background: gradients.page, color: colors.textPrimary, fontFamily: "system-ui, sans-serif", padding: "0 0 60px" }}>

      {/* Header */}
      <div style={{ background: "rgba(15,23,42,0.8)", borderBottom: `1px solid ${colors.borderSubtle}`, padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: gradients.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            🚘
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Driver Dashboard</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>{user?.name || user?.email || "Driver"}</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{ background: alpha.dangerBtn, border: `1px solid ${alpha.dangerBtnBorder}`, color: colors.dangerLight, padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
        >
          Sign out
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 0" }}>

        <DriverStatusCard />

        {/* Not verified warning */}
        {driverProfile && !isVerified && (
          <div style={{ background: alpha.warning08, border: `1px solid ${alpha.warning25}`, borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⏳</span>
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: colors.warningLight }}>Awaiting verification</p>
              <p style={{ margin: 0, fontSize: 13, color: colors.textSecondary, lineHeight: 1.5 }}>Your driver profile is under review. You'll be able to accept trips once verified by an admin.</p>
            </div>
          </div>
        )}

        {/* Offline empty state */}
        {!activeTripId && !isAvailable && driverProfile && isVerified && (
          <div style={{ background: colors.bgBase, border: `1px solid ${colors.border}`, borderRadius: 16, marginBottom: 16, textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>😴</div>
            <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700 }}>You're offline</p>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>Use the toggle above to go online and start accepting trips.</p>
          </div>
        )}

        {activeTripId && <ActiveTripCard />}

        {canShowMarketplace && <TripMarketplace />}

      </div>
    </div>
  );
}
