import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login, selectAuth, clearAuthError } from "../features/auth/authSlice";
import { getErrorMessage } from "../utils/errors";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from || "/";

  async function onSubmit(e) {
    e.preventDefault();
    dispatch(clearAuthError());

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Login</h2>

      {auth.error ? (
        <div style={{ background: "#fee", padding: 10, marginBottom: 10 }}>
          {getErrorMessage(auth.error, "Login failed")}
        </div>
      ) : null}

      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input
          style={{ width: "100%", padding: 8, margin: "6px 0 12px" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <label>Password</label>
        <input
          style={{ width: "100%", padding: 8, margin: "6px 0 12px" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        <button disabled={auth.status === "loading"} style={{ padding: 10, width: "100%" }}>
          {auth.status === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}