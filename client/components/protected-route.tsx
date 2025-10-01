import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "@/lib/cookies";
import React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const token = getCookie("access_token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ type: "error", message: "Please log in to continue.", from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
}
