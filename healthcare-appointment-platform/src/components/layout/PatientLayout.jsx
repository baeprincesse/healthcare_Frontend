import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
  ShieldCheck,
  UserRound,
  Brain,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import api from "../../services/api.js";
import logo from "../../assets/logo.jpg";

const primaryLinks = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/find-doctor", label: "Find Doctors", icon: Search },
  { to: "/appointments", label: "My Appointments", icon: CalendarDays },
  { to: "/medical-records", label: "Medical Records", icon: FileText },
  { to: "/medical-record-access", label: "Record Access Requests", icon: ShieldCheck },
  { to: "/prescriptions", label: "Prescriptions", icon: Pill },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/ai-health-assistant", label: "AI Health Assistant", icon: Brain },
];

const secondaryLinks = [
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function PatientLayout() {
  const { user, logout } = useAuth();
  const { unreadCount, socket } = useSocket();
  const navigate = useNavigate();
  const [pendingAccessCount, setPendingAccessCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadPendingAccessCount = async () => {
      try {
        const response = await api.get("/medical-record-access/requests/pending-count");
        if (!cancelled) setPendingAccessCount(response.data?.count || 0);
      } catch {
        if (!cancelled) setPendingAccessCount(0);
      }
    };

    loadPendingAccessCount();

    if (socket) {
      socket.on("medical_record_access:requested", loadPendingAccessCount);
      socket.on("medical_record_access:updated", loadPendingAccessCount);
    }

    return () => {
      cancelled = true;
      if (socket) {
        socket.off("medical_record_access:requested", loadPendingAccessCount);
        socket.off("medical_record_access:updated", loadPendingAccessCount);
      }
    };
  }, [socket]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const switchToDoctorMode = () => {
    localStorage.setItem("activeMode", "doctor");
    navigate("/doctor/dashboard");
  };

  const linkClass = ({ isActive }) =>
    `flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-emerald-500 text-white shadow-sm"
        : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#152420]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] flex-col bg-[#0C3A31] lg:flex">
        <div className="flex h-[76px] items-center px-5">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="MediCare"
              className="h-10 w-10 shrink-0 rounded-xl bg-white/10 object-contain p-1.5"
            />
            <div className="min-w-0">
              <h1 className="truncate text-lg font-extrabold tracking-tight text-white">
                MediCare
              </h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-3">
          {primaryLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={18} strokeWidth={2} />
              <span className="flex-1">{label}</span>
              {to === "/notifications" && unreadCount > 0 && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
              {to === "/medical-record-access" && pendingAccessCount > 0 && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {pendingAccessCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          {user?.role === "DOCTOR" && (
            <button onClick={switchToDoctorMode} className={linkClass({ isActive: false })}>
              <UserRound size={18} />
              <span>Doctor Mode</span>
            </button>
          )}
          {secondaryLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-emerald-100/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="lg:pl-[250px]">
        <header className="sticky top-0 z-20 border-b border-[#E7ECE9] bg-white/95 backdrop-blur">
          <div className="flex h-[76px] items-center justify-between px-5 sm:px-8">
            <div className="flex items-center lg:hidden">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="MediCare"
                className="h-8 w-8 shrink-0 rounded-lg object-contain"
              />
              <span className="text-base font-extrabold tracking-tight text-[#152420]">
                MediCare
              </span>
            </div>
          </div>

            <div className="hidden lg:block" />

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/notifications")}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E7ECE9] bg-white hover:bg-[#F5F7F6]"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {(user?.name || "Patient").slice(0, 2).toUpperCase()}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold">
                    {user?.name || "Patient"}
                  </p>
                  <p className="text-xs text-[#6E7B76]">Patient</p>
                </div>
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-76px)] px-5 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
