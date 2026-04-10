import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, selectUser } from "../features/auth/authSlice";
import { LogOut, User } from "lucide-react";
import NotificationCenter from "../pages/Rider/components/NotificationCenter";
import { colors, gradients } from "../styles/theme";
import DrivlyLogo from "../components/DrivlyLogo";

export default function RiderLayout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: gradients.page, color: colors.textPrimary, fontFamily: "system-ui, sans-serif" }}>
      {/* Shared top header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: `1px solid ${colors.border}`,
          background: colors.bgBase,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Left: logo + user info */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <DrivlyLogo onClick={() => navigate("/rider")} />
          <div style={{ width: 1, height: 28, background: colors.border }} />
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: gradients.avatar,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={18} color="#fff" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: colors.textSecondary }}>Welcome back</p>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{user?.name || "Rider"}</p>
          </div>
        </div>

        {/* Right: notification bell + sign out */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <NotificationCenter />
          <button
            onClick={() => dispatch(logout())}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: `1px solid ${colors.border}`,
              color: colors.textSecondary,
              padding: "7px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.textPrimary;
              e.currentTarget.style.borderColor = colors.textFaint;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.textSecondary;
              e.currentTarget.style.borderColor = colors.border;
            }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </header>

      <Toaster position="top-right" containerStyle={{ top: 70 }} />
      <Outlet />
    </div>
  );
}
