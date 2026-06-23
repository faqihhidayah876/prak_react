import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";
import Loading from "./Loading";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    // Jika bukan admin, redirect ke dashboard member
    if (profile?.role === "member") {
      return <Navigate to="/" replace />;
    }
    // Jika role tidak dikenal, redirect ke login
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}