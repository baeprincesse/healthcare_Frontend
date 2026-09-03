import { useAuth } from '../../context/AuthContext'

export default function DashboardHeader() {
  const { user } = useAuth()

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-green-100">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Patient'} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your health today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-green-50 rounded-lg transition">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-green-100">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Patient'}</p>
              <p className="text-xs text-gray-500">Patient</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">
              👤
            </div>
            <button className="text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
