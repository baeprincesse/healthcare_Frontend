import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { authenticated } = useAuth();
  const location = useLocation();
  const hasToken = Boolean(localStorage.getItem("token"));

  if (!authenticated || !hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
