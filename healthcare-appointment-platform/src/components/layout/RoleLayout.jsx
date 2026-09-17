import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { CalendarDays, Home, LogOut, Settings, UserRound, Users, Stethoscope, ClipboardList } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/logo.jpg";

export default function RoleLayout({ role, title, links }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const logoutNow = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const switchToPatientMode = () => {
    localStorage.setItem("activeMode", "patient");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#0C3A31] lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
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
              <p className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-wider text-emerald-200/80">
                {title}
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-sm font-semibold text-white">{user?.name || title}</p>
          <p className="mt-1 text-xs text-emerald-100/70">{role}</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          {user?.role === "DOCTOR" && (
            <button onClick={switchToPatientMode} className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-emerald-100 hover:bg-white/10">
              <UserRound size={18} />
              Patient Mode
            </button>
          )}
          <button onClick={logoutNow} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-200 hover:bg-white/10">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
