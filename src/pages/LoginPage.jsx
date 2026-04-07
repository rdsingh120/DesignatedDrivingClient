import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login, selectAuth, clearAuthError } from "../features/auth/authSlice";
import { getErrorMessage } from "../utils/errors";
import { colors, gradients, inputStyle, btn, errorBanner } from "../styles/theme";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from;

  async function onSubmit(e) {
    e.preventDefault();
    dispatch(clearAuthError());

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      const role = (result.payload?.user?.role || "").toUpperCase();
      const dest = from && from !== "/" ? from : role === "DRIVER" ? "/driver" : role === "ADMIN" ? "/admin" : "/rider";
      navigate(dest, { replace: true });
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: gradients.page, color: colors.textPrimary, fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "0 24px" }}>

        {/* Logo / title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: gradients.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px" }}>
            🚘
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700 }}>Designated Driving</h1>
          <p style={{ margin: 0, fontSize: 14, color: colors.textMuted }}>Sign in to your account</p>
        </div>

        {/* Error */}
        {auth.error && (
          <div style={{ ...errorBanner, marginBottom: 16 }}>
            {getErrorMessage(auth.error, "Login failed")}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, color: colors.textMuted, marginBottom: 6 }}>Email</label>
            <input
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, color: colors.textMuted, marginBottom: 6 }}>Password</label>
            <input
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            disabled={auth.status === "loading"}
            style={{ ...btn.primary, width: "100%", padding: "12px 0", fontSize: 15, opacity: auth.status === "loading" ? 0.6 : 1 }}
          >
            {auth.status === "loading" ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: "center", fontSize: 14, color: colors.textMuted }}>
          No account?{" "}
          <Link to="/register" style={{ color: colors.primaryFaint, fontWeight: 600, textDecoration: "none" }}>
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
