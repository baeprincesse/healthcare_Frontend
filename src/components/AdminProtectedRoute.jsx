import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminProtectedRoute() {
  const { authenticated, user } = useAuth()
  const location = useLocation()

  if (!authenticated || !user || user.role !== 'Admin') {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <Outlet />
}
