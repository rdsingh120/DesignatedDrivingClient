import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { register, selectAuth, clearAuthError } from "../features/auth/authSlice";
import { getErrorMessage } from "../utils/errors";

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
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Register</h2>

      {auth.error ? (
        <div style={{ background: "#fee", padding: 10, marginBottom: 10 }}>
          {getErrorMessage(auth.error, "Register failed")}
        </div>
      ) : null}

      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input
          style={{ width: "100%", padding: 8, margin: "6px 0 12px" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          style={{ width: "100%", padding: 8, margin: "6px 0 12px" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <label>Role</label>
        <select
          style={{ width: "100%", padding: 8, margin: "6px 0 12px" }}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="RIDER">RIDER</option>
          <option value="DRIVER">DRIVER</option>
        </select>

        <label>Password</label>
        <input
          style={{ width: "100%", padding: 8, margin: "6px 0 12px" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        <button disabled={auth.status === "loading"} style={{ padding: 10, width: "100%" }}>
          {auth.status === "loading" ? "Creating..." : "Create account"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}