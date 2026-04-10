// src/components/DriverNavBar.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, selectUser } from "../features/auth/authSlice";
import {
  updateMyDriverStatus,
} from "../features/driver/driverProfilesSlice";
import { colors, alpha, gradients } from "../styles/theme";

export default function DriverNavBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const driverProfile = useAppSelector((s) => s.driverProfiles.me);
  const isAvailable = driverProfile?.availability === "AVAILABLE";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function handleSignOut() {
    if (isAvailable) {
      await dispatch(updateMyDriverStatus({ availability: "OFFLINE" }));
    }
    dispatch(logout());
  }

  return (
    <div style={{
      background: "rgba(15,23,42,0.8)",
      borderBottom: `1px solid ${colors.borderSubtle}`,
      padding: "16px 28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backdropFilter: "blur(8px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      {/* Left: hamburger + avatar + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            style={{
              background: menuOpen ? alpha.neutral15 : "transparent",
              border: `1px solid ${menuOpen ? colors.border : "transparent"}`,
              color: colors.textSecondary,
              width: 38, height: 38, borderRadius: 8,
              cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 4, transition: "background 0.15s, border-color 0.15s",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ display: "block", width: 18, height: 2, background: colors.textSecondary, borderRadius: 1 }} />
            ))}
          </button>

          {menuOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0,
              minWidth: 200, background: colors.bgBase,
              border: `1px solid ${colors.border}`, borderRadius: 12,
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)", overflow: "hidden", zIndex: 100,
            }}>
              {[
                { icon: "🏠", label: "Dashboard",    path: "/driver" },
                { icon: "🗂️", label: "Trip History", path: "/driver/history" },
                { icon: "⭐", label: "My Ratings",   path: "/driver/ratings" },
                { icon: "👤", label: "My Profile",   path: "/driver/profile" },
              ].map(({ icon, label, path }) => (
                <button
                  key={label}
                  onClick={() => { setMenuOpen(false); navigate(path); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    width: "100%", padding: "12px 16px",
                    background: "transparent", border: "none",
                    borderBottom: `1px solid ${colors.border}`,
                    color: colors.textPrimary, fontSize: 14, fontWeight: 500,
                    cursor: "pointer", textAlign: "left", transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = alpha.neutral15}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", background: gradients.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {driverProfile?.profilePhoto ? (
            <img src={`${import.meta.env.VITE_API_BASE_URL}${driverProfile.profilePhoto}`} alt="Driver" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 18 }}>🚘</span>
          )}
        </div>

        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Driver Dashboard</div>
          <div style={{ fontSize: 12, color: colors.textMuted }}>{user?.name || user?.email || "Driver"}</div>
        </div>
      </div>

      {/* Right: sign out */}
      <button
        onClick={handleSignOut}
        style={{
          background: alpha.dangerBtn, border: `1px solid ${alpha.dangerBtnBorder}`,
          color: colors.dangerLight, padding: "7px 14px",
          borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
        }}
      >
        Sign out
      </button>
    </div>
  );
}
