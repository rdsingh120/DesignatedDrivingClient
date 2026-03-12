import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { register, selectAuth, clearAuthError } from "../features/auth/authSlice";
import { getErrorMessage } from "../utils/errors";
import { colors, gradients, inputStyle, btn, errorBanner } from "../styles/theme";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("RIDER");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    dispatch(clearAuthError());

    const result = await dispatch(register({ name, email, password, role }));
    if (register.fulfilled.match(result)) {
      navigate("/", { replace: true });
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: gradients.page,
        color: colors.textPrimary,
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, padding: "0 24px" }}>
        {/* Logo / title */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: gradients.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              margin: "0 auto 16px",
            }}
          >
            🚘
          </div>

          <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700 }}>Create Account</h1>

          <p style={{ margin: 0, fontSize: 14, color: colors.textMuted }}>
            Register to start using Designated Driving
          </p>
        </div>

        {/* Error */}
        {auth.error && (
          <div style={{ ...errorBanner, marginBottom: 16 }}>
            {getErrorMessage(auth.error, "Register failed")}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          <div>
            <label
              style={{ display: "block", fontSize: 13, color: colors.textMuted, marginBottom: 6 }}
            >
              Name
            </label>
            <input
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label
              style={{ display: "block", fontSize: 13, color: colors.textMuted, marginBottom: 6 }}
            >
              Email
            </label>
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
            <label
              style={{ display: "block", fontSize: 13, color: colors.textMuted, marginBottom: 6 }}
            >
              Role
            </label>

            <select style={inputStyle} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="RIDER">RIDER</option>
              <option value="DRIVER">DRIVER</option>
            </select>
          </div>

          <div>
            <label
              style={{ display: "block", fontSize: 13, color: colors.textMuted, marginBottom: 6 }}
            >
              Password
            </label>
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
            style={{
              ...btn.primary,
              width: "100%",
              padding: "12px 0",
              fontSize: 15,
              opacity: auth.status === "loading" ? 0.6 : 1,
            }}
          >
            {auth.status === "loading" ? "Creating…" : "Create account"}
          </button>
        </form>

        <p
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 14,
            color: colors.textMuted,
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: colors.primaryFaint,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
