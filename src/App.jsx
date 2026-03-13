import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import DriverDashboardPage from "./pages/Driver/DriverDashboardPage";
import RateTripPage from "./pages/RateTripPage";
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


function RoleRedirect() {
  const role = useAppSelector(selectRole);
  if (role === "RIDER") return <Navigate to="/rider" replace />;
  if (role === "DRIVER") return <Navigate to="/driver" replace />;
  return <Navigate to="/login" replace />;
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
          <Route path="/" element={<RoleRedirect />} />

          {/* Rider (protected + role-gated) */}
          <Route element={<RoleRoute allow={["RIDER"]} />}>
            <Route path="/rider" element={<RiderDashboardPage />} />
            <Route path="/rider/vehicles" element={<RiderVehiclesPage />} />
            <Route path="/rider/request" element={<RiderRequestPage />} />
            <Route path="/rider/trip/:id" element={<RiderTripPage />} />
            <Route path="/rider/history" element={<RiderTripHistoryPage />} />
          {/* Rating page */}
            <Route path="/rider/rate/:tripId" element={<RateTripPage />} />
          </Route>
          
          {/* Driver (protected + role-gated) */}
          <Route element={<RoleRoute allow={["DRIVER"]} />}>
            <Route path="/driver" element={<DriverDashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}