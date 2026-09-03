import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Building2,
  ClipboardCheck,
  Hospital,
  LogOut,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const menuItems = [
  {
    to: "/platform-admin/dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    to: "/platform-admin/hospital-requests",
    label: "Hospital Requests",
    icon: ClipboardCheck,
  },
  {
    to: "/platform-admin/pending-doctors",
    label: "Doctor Approvals",
    icon: Stethoscope,
  },
  {
    to: "/platform-admin/hospitals",
    label: "Hospitals",
    icon: Building2,
  },
  {
    to: "/platform-admin/users",
    label: "Manage Users",
    icon: Users,
  },
  {
    to: "/platform-admin/profile",
    label: "Profile",
    icon: ShieldCheck,
  },
  {
    to: "/platform-admin/settings",
    label: "System Settings",
    icon: Settings,
  },
];

export default function SystemAdminSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sticky top-6 flex h-fit max-h-[calc(100vh-3rem)] flex-col overflow-y-auto rounded-2xl border border-emerald-100 bg-white shadow-sm">
      <div className="border-b border-emerald-50 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Hospital size={23} />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">MediCare</h1>
            <p className="text-xs text-gray-500">System Administration</p>
          </div>
        </div>
      </div>

      <div className="border-b border-emerald-50 px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Administrator
        </p>
        <p className="mt-1 font-semibold text-gray-900">
          {user?.name || "System Administrator"}
        </p>
        <span className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          System Administrator
        </span>
      </div>

      <nav className="px-3 py-5">
        <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Platform Management
        </p>

        <div className="space-y-1">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-emerald-50 font-semibold text-emerald-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={18} />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="mt-auto border-t border-emerald-50 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
