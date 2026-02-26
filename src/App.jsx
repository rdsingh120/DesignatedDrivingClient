import React from "react";
import { Navigate } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import { useAppDispatch } from "./app/hooks";
import { logout } from "./features/auth/authSlice";

import RiderVehiclesPage from "./pages/Rider/RiderVehiclesPage";
import RiderRequestPage from "./pages/Rider/RiderRequestPage";
import RiderTripPage from "./pages/Rider/RiderTripPage";
import RiderTripHistoryPage from "./pages/Rider/RiderTripHistoryPage";

function Home() {
  const dispatch = useAppDispatch();

  return (
    <div style={{ padding: 20 }}>
      <h2>Home</h2>
      <button onClick={() => dispatch(logout())}>Logout</button>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link to="/rider">Rider Area</Link>
        <Link to="/driver">Driver Area</Link>
        <Link to="/rider/history">Trip History</Link>
      </div>
    </div>
  );
}

function DriverStub() {
  return (
    <div style={{ padding: 20 }}>
      <h3>Driver MVP (Phase 4)</h3>
      <p>Driver screens coming next.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />

          {/* Rider (protected + role-gated) */}
          <Route element={<RoleRoute allow={["RIDER"]} />}>
            <Route path="/rider" element={<RiderVehiclesPage />} />
            <Route path="/rider/request" element={<RiderRequestPage />} />
            <Route path="/rider/trip/:id" element={<RiderTripPage />} />
            <Route path="/rider/history" element={<RiderTripHistoryPage />} />
          </Route>

          {/* Driver (protected + role-gated) */}
          <Route element={<RoleRoute allow={["DRIVER"]} />}>
            <Route path="/driver" element={<DriverStub />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}