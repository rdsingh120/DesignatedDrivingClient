import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import DriverDashboardPage from "./pages/Driver/DriverDashboardPage";
import DriverProfilePage from "./pages/Driver/DriverProfilePage";
import DriverTripDetailPage from "./pages/Driver/DriverTripDetailPage";

import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import { useAppSelector } from "./app/hooks";
import { selectRole } from "./features/auth/authSlice";

import RiderDashboardPage from "./pages/Rider/RiderDashboardPage";
import RiderVehiclesPage from "./pages/Rider/RiderVehiclesPage";
import RiderRequestPage from "./pages/Rider/RiderRequestPage";
import RiderTripPage from "./pages/Rider/RiderTripPage";
import RiderTripHistoryPage from "./pages/Rider/RiderTripHistoryPage";
import RiderProfilePage from "./pages/Rider/RiderProfilePage";
import { waitForAPI } from "./utils/apiWakeCheck";
import APILoadingScreen from "./components/APILoadingScreen";

function RoleRedirect() {
  const role = useAppSelector(selectRole);
  if (role === "RIDER") return <Navigate to="/rider" replace />;
  if (role === "DRIVER") return <Navigate to="/driver" replace />;
  if (role === "ADMIN") return <Navigate to="/admin" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    waitForAPI().then(() => setApiReady(true));
  }, []);

  if (!apiReady) {
    return <APILoadingScreen />;
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<RoleRedirect />} />

          {/* Rider (protected + role-gated) */}
          <Route element={<RoleRoute allow={["RIDER"]} />}>
            <Route path="/rider" element={<RiderDashboardPage />} />
            <Route path="/rider/vehicles" element={<RiderVehiclesPage />} />
            <Route path="/rider/request" element={<RiderRequestPage />} />
            <Route path="/rider/trip/:id" element={<RiderTripPage />} />
            <Route path="/rider/history" element={<RiderTripHistoryPage />} />
            <Route element={<RoleRoute allow={["RIDER"]} />}>
              <Route path="/rider" element={<RiderDashboardPage />} />
              <Route path="/rider/vehicles" element={<RiderVehiclesPage />} />
              <Route path="/rider/request" element={<RiderRequestPage />} />
              <Route path="/rider/trip/:id" element={<RiderTripPage />} />
              <Route path="/rider/history" element={<RiderTripHistoryPage />} />
              <Route path="/rider/profile" element={<RiderProfilePage />} />
            </Route>
          </Route>

          {/* Driver (protected + role-gated) */}
          <Route element={<RoleRoute allow={["DRIVER"]} />}>
            <Route path="/driver" element={<DriverDashboardPage />} />
            <Route path="/driver/profile" element={<DriverProfilePage />} />
            <Route path="/driver/trip/:id" element={<DriverTripDetailPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allow={["ADMIN"]} />}>
  <Route path="/admin" element={<AdminDashboardPage />} />
</Route>
      </Routes>
    </BrowserRouter>
  );
}