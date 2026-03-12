import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { register, selectAuth, clearAuthError } from "../features/auth/authSlice";
import { getErrorMessage } from "../utils/errors";
import { colors, pageStyle, cardStyle, inputStyle, btn, errorBanner } from "../styles/theme";

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
    <div style={pageStyle}>
      <div style={{ padding: "20px 24px 0", marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Create Account</h2>

        <p
          style={{
            margin: "6px 0 0",
            color: colors.textMuted,
            fontSize: 14,
          }}
        >
          Register to book or drive with Designated Driving.
        </p>
      </div>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "0 24px" }}>
        {auth.error ? (
          <div style={{ ...errorBanner, marginBottom: 16 }}>
            {getErrorMessage(auth.error, "Register failed")}
          </div>
        ) : null}

        <div style={cardStyle}>
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
            <div>
              <label
                style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Name
              </label>

              <input
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Email
              </label>

              <input
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  display: "block",
                  marginBottom: 4,
                }}
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
                style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Password
              </label>

              <input
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>

            <button
              disabled={auth.status === "loading"}
              style={{
                ...btn.primary,
                marginTop: 6,
                opacity: auth.status === "loading" ? 0.7 : 1,
              }}
            >
              {auth.status === "loading" ? "Creating..." : "Create account"}
            </button>
          </form>

          <p
            style={{
              marginTop: 14,
              fontSize: 14,
              color: colors.textMuted,
            }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: colors.primary, textDecoration: "none" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
