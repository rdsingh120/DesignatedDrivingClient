import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectRole } from "../features/auth/authSlice";



export default function RoleRoute({ allow = [] }) {
  const role = useAppSelector(selectRole);
  const allowed = allow.map((r) => String(r).toUpperCase());

  if (!allowed.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}