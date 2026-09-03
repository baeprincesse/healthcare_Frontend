import { CalendarDays, Hospital, Users, Stethoscope } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";

export function HospitalAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ doctors: 0, staff: 0, appointmentsToday: 0, totalAppointments: 0 });
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [hospitalRes, statsRes] = await Promise.all([
        api.get("/hospitals/my-hospital"),
        api.get("/hospitals/my-hospital/stats"),
      ]);
      setHospital(hospitalRes.data?.hospital || null);
      setStats(statsRes.data?.data || { doctors: 0, staff: 0, appointmentsToday: 0, totalAppointments: 0 });
    } catch {
      setError("Unable to load hospital data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const cards = [
    { icon: Stethoscope, label: "Doctors", value: loading ? "—" : stats.doctors },
    { icon: Users, label: "Total Staff", value: loading ? "—" : stats.staff },
    { icon: CalendarDays, label: "Appointments Today", value: loading ? "—" : stats.appointmentsToday },
  ];

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold text-emerald-600">MediCare</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">Hospital Administrator Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">
          Welcome, {user?.name || "Administrator"}. Manage your hospital, staff and hospital operations.
        </p>
        {hospital && (
          <p className="mt-1 text-sm text-emerald-700">
            Hospital: <span className="font-semibold">{hospital.name}</span>
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        {cards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Icon size={21} />
            </div>
            <p className="mt-5 text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Link to="/hospital-admin/staff" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-emerald-200 hover:bg-emerald-50">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Users size={21} />
          </div>
          <p className="mt-5 text-sm font-semibold text-gray-900">Manage Staff</p>
          <p className="mt-1 text-sm text-gray-500">View and manage doctors, secretaries and staff at your hospital.</p>
        </Link>
        <Link to="/hospital-admin/appointments" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-emerald-200 hover:bg-emerald-50">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <CalendarDays size={21} />
          </div>
          <p className="mt-5 text-sm font-semibold text-gray-900">Hospital Appointments</p>
          <p className="mt-1 text-sm text-gray-500">View all appointments at your hospital.</p>
        </Link>
      </div>
    </div>
  );
}

