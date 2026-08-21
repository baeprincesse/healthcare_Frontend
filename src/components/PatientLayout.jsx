import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Bell,
  CalendarDays,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Pill,
  Search,
  Settings,
  UserRound,
  Hospital,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext.jsx'
import logo from '../assets/logo.jpg'

const primaryLinks = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: Home,
  },
  {
    to: '/find-doctor',
    label: 'Find Doctors',
    icon: Search,
  },
  {
    to: '/appointments',
    label: 'My Appointments',
    icon: CalendarDays,
  },
  {
    to: '/medical-records',
    label: 'Medical Records',
    icon: FileText,
  },
  {
    to: '/prescriptions',
    label: 'Prescriptions',
    icon: Pill,
  },
  {
    to: '/payments',
    label: 'Payments',
    icon: CreditCard,
  },
  {
    to: '/notifications',
    label: 'Notifications',
    icon: Bell,
    badge: 3,
  },
  {
    to:'/create',
    label:'CreateHospital',
    icon:Hospital,
  },
]

const secondaryLinks = [
  {
    to: '/profile',
    label: 'Profile',
    icon: UserRound,
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
  },
]

export default function PatientLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'bg-emerald-500 text-white shadow-sm'
        : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
    }`

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#152420]">

      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] flex-col bg-[#0C3A31] lg:flex">

        {/* LOGO */}
        <div className="flex h-[76px] items-center px-5">
          <img
            src={logo}
            alt="Platform Logo"
            className="h-12 w-auto max-w-[190px] object-contain"
          />
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-3">

          {primaryLinks.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClass}
            >
              <Icon size={18} strokeWidth={2} />

              <span className="flex-1">
                {label}
              </span>

              {badge && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}

        </nav>

        {/* BOTTOM NAVIGATION */}
        <div className="border-t border-white/10 px-4 py-4">

          {secondaryLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClass}
            >
              <Icon size={18} strokeWidth={2} />

              <span>
                {label}
              </span>
            </NavLink>
          ))}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-emerald-100/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} strokeWidth={2} />

            <span>
              Logout
            </span>
          </button>

        </div>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <div className="lg:pl-[250px]">

        {/* =========================
            HEADER
        ========================== */}
        <header className="sticky top-0 z-20 border-b border-[#E7ECE9] bg-white/95 backdrop-blur">

          <div className="flex h-[76px] items-center justify-between px-5 sm:px-8">

            {/* MOBILE LOGO */}
            <div className="flex items-center lg:hidden">
              <img
                src={logo}
                alt="Platform Logo"
                className="h-10 w-auto max-w-[160px] object-contain"
              />
            </div>

            {/* DESKTOP EMPTY SPACE */}
            <div className="hidden lg:block" />

            {/* HEADER RIGHT */}
            <div className="flex items-center gap-4">

              {/* NOTIFICATION */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E7ECE9] bg-white transition hover:bg-[#F5F7F6]"
                aria-label="Notifications"
              >
                <Bell size={18} />

                <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  3
                </span>
              </button>

              {/* USER */}
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2.5"
              >

                {/* USER INITIALS */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {(user?.name || 'Patient')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                {/* USER NAME */}
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold">
                    {user?.name || 'Patient'}
                  </p>

                  <p className="text-xs text-[#6E7B76]">
                    Patient
                  </p>
                </div>

              </button>

            </div>

          </div>

        </header>

        {/* =========================
            PAGE CONTENT
        ========================== */}
        <main className="min-h-[calc(100vh-76px)] px-5 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>

      </div>
    </div>
  )
}