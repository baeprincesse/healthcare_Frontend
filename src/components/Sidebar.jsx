import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SupportCard from './SupportCard'

export default function Sidebar(){
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '📅', label: 'Appointments', path: '/appointments' },
    { icon: '👨‍⚕️', label: 'Find Doctors', path: '/doctors' },
    { icon: '📋', label: 'Medical Records', path: '/medical-records' },
    { icon: '💊', label: 'Prescriptions', path: '/prescriptions' },
    { icon: '💳', label: 'Payments', path: '/payments' },
    { icon: '🔔', label: 'Notifications', path: '/notifications' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-green-50 h-fit sticky top-8 overflow-y-auto max-h-[calc(100vh-2rem)]">
      {/* Logo/Header */}
      <div className="px-6 py-6 border-b border-green-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white text-lg">
            💚
          </div>
          <div>
            <div className="font-bold text-lg text-gray-900">MediCare</div>
            <div className="text-xs text-gray-500">Health Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="px-3 py-6">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-green-50 text-green-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Support Section */}
      <div className="px-3 py-4 border-t border-green-50">
        <SupportCard />
      </div>

      {/* Logout Button */}
      <div className="px-3 py-4 border-t border-green-50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
        >
          <span className="text-lg">🚪</span>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  )
}
