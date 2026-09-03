import { CalendarDays, ClipboardList, Hospital, Stethoscope, Users, Plus, Trash2, Video } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function Dashboard({ title, subtitle, cards }) {
  const { user } = useAuth();

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold text-emerald-600">MediCare</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Welcome, {user?.name || "User"}. {subtitle}
        </p>
      </div>

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

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Dashboard Overview</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          This role has its own dashboard and navigation. The role-specific operational modules can be connected to the backend here.
        </p>
      </div>
    </div>
  );
}

export function HospitalAdminDashboard() {
  return (
    <Dashboard
      title="Hospital Administrator Dashboard"
      subtitle="Manage your hospital, staff and hospital operations."
      cards={[
        { icon: Hospital, label: "Hospital", value: "1" },
        { icon: Users, label: "Staff Members", value: "—" },
        { icon: CalendarDays, label: "Appointments", value: "—" },
      ]}
    />
  );
}

export function DoctorDashboard() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [availRes, apptRes, profileRes] = await Promise.all([
        api.get("/doctors/me/availability"),
        api.get("/doctors/me/appointments"),
        api.get("/users/doctor/profile"),
      ]);
      setAvailability(availRes.data?.data || []);
      setAppointments(apptRes.data?.data || []);
      setHospital(profileRes.data?.hospital || null);
    } catch {
      setError("Unable to load your data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!hospital) {
      setError("No hospital association found. Please contact your administrator.");
      return;
    }
    if (startTime >= endTime) {
      setError("Start time must be before end time.");
      return;
    }
    try {
      await api.post("/doctors/me/availability", {
        hospitalId: hospital.id,
        dayOfWeek,
        startTime,
        endTime,
      });
      setSuccess("Availability saved.");
      setStartTime("08:00");
      setEndTime("16:00");
      fetchData();
    } catch {
      setError(err.response?.data?.message || "Unable to save availability.");
    }
  };

  const handleDeleteAvailability = async (id) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/doctors/me/availability/${id}`);
      setSuccess("Availability removed.");
      fetchData();
    } catch {
      setError(err.response?.data?.message || "Unable to delete availability.");
    }
  };

  const upcomingCount = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  ).length;

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold text-emerald-600">MediCare</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">Doctor Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">
          Welcome, {user?.name || "Doctor"}. Manage your schedule, appointments and patients.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <CalendarDays size={21} />
          </div>
          <p className="mt-5 text-sm text-gray-500">Upcoming Appointments</p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">{upcomingCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Users size={21} />
          </div>
          <p className="mt-5 text-sm text-gray-500">Total Appointments</p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">{appointments.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ClipboardList size={21} />
          </div>
          <p className="mt-5 text-sm text-gray-500">Availability Slots</p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">{availability.length}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>
      )}
      {success && (
        <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{success}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">My Availability</h2>
          <p className="mt-1 text-sm text-gray-500">Set when you are available for appointments.</p>

          {hospital && (
            <p className="mt-2 text-xs text-emerald-700">Hospital: <span className="font-semibold">{hospital.name}</span></p>
          )}

          <form onSubmit={handleAddAvailability} className="mt-4 space-y-3">
            <label className="block text-xs font-medium text-slate-700">
              Day
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium text-slate-700">
              Start Time
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block text-xs font-medium text-slate-700">
              End Time
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <button
              type="submit"
              disabled={!hospital}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={14} /> Save Availability
            </button>
          </form>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#98A29D]">Current Schedule</p>
            {loading ? (
              <p className="mt-2 text-sm text-gray-500">Loading...</p>
            ) : availability.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">No availability has been configured.</p>
            ) : (
              <div className="mt-2 space-y-2">
                {availability.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-xs">
                    <span>
                      <span className="font-semibold">{a.dayOfWeek}</span> {a.startTime} - {a.endTime}
                    </span>
                    <button
                      onClick={() => handleDeleteAvailability(a.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">My Appointments</h2>
          <p className="mt-1 text-sm text-gray-500">Appointments booked with you.</p>

          {loading ? (
            <p className="mt-4 text-sm text-gray-500">Loading...</p>
          ) : appointments.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No appointments yet.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {appointments.slice(0, 10).map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-xs">
                  <div>
                    <p className="font-semibold">{a.patient?.name || "Patient"}</p>
                    <p className="text-gray-500">{a.appointmentDate} · {a.appointmentTime}</p>
                    <p className="text-emerald-700 font-medium">{a.consultationType === 'online' ? 'Online Consultation' : 'On-site Consultation'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.consultationType === 'online' && a.jitsiMeetingUrl && (
                      <Link to={`/video-consultation/${a.id}`} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700"><Video size={12} /> Join</Link>
                    )}
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SecretaryDashboard() {
  return (
    <Dashboard
      title="Secretary Dashboard"
      subtitle="Manage appointments and assist hospital operations."
      cards={[
        { icon: CalendarDays, label: "Appointments", value: "—" },
        { icon: Users, label: "Patients", value: "—" },
        { icon: Stethoscope, label: "Doctors", value: "—" },
      ]}
    />
  );
}

