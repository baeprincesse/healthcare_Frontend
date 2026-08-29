import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminProtectedRoute() {
  const { authenticated, user } = useAuth();
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "system_admin") {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
