import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  updateMyDriverStatus,
  createMyDriverProfile,
} from "../../../features/driver/driverProfilesSlice";
import { cardStyle, sectionLabel } from "./driverDashboardStyles";
import { colors, alpha, gradients } from "../../../styles/theme";

function VerificationBadge({ status }) {
  const map = {
    VERIFIED:   { bg: alpha.success15,  color: colors.successLight, label: "Verified" },
    PENDING:    { bg: alpha.warning15,  color: colors.warningLight, label: "Pending Review" },
    REJECTED:   { bg: alpha.danger15,   color: colors.dangerLight,  label: "Rejected" },
    UNVERIFIED: { bg: alpha.neutral15,  color: colors.textSecondary, label: "Unverified" },
  };
  const s = map[status] || map.UNVERIFIED;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
      {s.label}
    </span>
  );
}

export default function DriverStatusCard() {
  const dispatch = useAppDispatch();
  const driverProfile = useAppSelector((s) => s.driverProfiles.me);
  const dpLoading = useAppSelector((s) => s.driverProfiles.loading);

  const availability = driverProfile?.availability;
  const isAvailable = availability === "AVAILABLE";
  const isBusy = availability === "BUSY";

  const toggleAvailability = () => {
    const next = isAvailable ? "OFFLINE" : "AVAILABLE";
    dispatch(updateMyDriverStatus({ availability: next }));
  };

  return (
    <div style={cardStyle}>
      <p style={sectionLabel}>Your Status</p>

      {dpLoading && !driverProfile ? (
        <p style={{ margin: 0, color: colors.textMuted, fontSize: 14 }}>Loading profile…</p>
      ) : !driverProfile ? (
        <div>
          <p style={{ margin: "0 0 12px", color: colors.textSecondary, fontSize: 14 }}>
            No driver profile found. Create one to start accepting trips.
          </p>
          <button
            onClick={() => dispatch(createMyDriverProfile())}
            style={{ padding: "10px 20px", background: gradients.primary, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
          >
            Create Driver Profile
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Verification</p>
              <VerificationBadge status={driverProfile.verificationStatus} />
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Availability</p>
              <span style={{
                background: isBusy ? alpha.primary15 : isAvailable ? alpha.success15 : alpha.neutral15,
                color: isBusy ? colors.primaryLight : isAvailable ? colors.successLight : colors.textSecondary,
                fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
              }}>
                {isBusy ? "In a Trip" : isAvailable ? "Available" : "Offline"}
              </span>
            </div>
            {driverProfile.activeTrip && (
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: colors.textMuted }}>Active Trip</p>
                <span style={{ fontSize: 13, color: colors.primaryLight, fontFamily: "monospace" }}>
                  {String(driverProfile.activeTrip)}
                </span>
              </div>
            )}
          </div>

          {!isBusy && (
            <button
              onClick={toggleAvailability}
              disabled={dpLoading}
              style={{
                padding: "10px 22px",
                background: isAvailable ? alpha.neutral15 : gradients.primary,
                color: isAvailable ? colors.textSecondary : "#fff",
                border: isAvailable ? `1px solid ${colors.border}` : "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                opacity: dpLoading ? 0.6 : 1,
              }}
            >
              {isAvailable ? "Go Offline" : "Go Online"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
