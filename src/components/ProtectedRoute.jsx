import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles = [] }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!token || !user) return <Navigate to="/login" />;
  if (roles.length && !roles.includes(user.role))
    return <Navigate to="/login" />;
  return children;
}
