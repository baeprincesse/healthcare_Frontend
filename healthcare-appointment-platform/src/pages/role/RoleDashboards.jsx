import { CalendarDays, ClipboardList, Clock3, FileText, Hospital, Stethoscope, Users, Plus, Trash2, Video, Play, StopCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api.js";

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
  const navigate = useNavigate();
  const [availability, setAvailability] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [startingId, setStartingId] = useState(null);
  const [endingId, setEndingId] = useState(null);
  const [accountStatus, setAccountStatus] = useState(user?.accountStatus);

  const today = new Date().toISOString().split("T")[0];

  const fetchData = useCallback(async () => {
    if (accountStatus !== "APPROVED") return;
    setLoading(true);
    try {
      const [availRes, apptRes, profileRes] = await Promise.all([
        api.get("/availability/me"),
        api.get("/doctors/me/appointments"),
        api.get("/users/doctor/profile"),
      ]);
      setAvailability(availRes.data?.data || []);
      setAppointments(apptRes.data?.data || []);
      setHospital(profileRes.data?.hospital || null);
      setAccountStatus(profileRes.data?.user?.accountStatus || "APPROVED");
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response?.data?.message || "Your account is awaiting approval.");
        setAccountStatus(err.response?.data?.accountStatus || "PENDING_APPROVAL");
      } else {
        setError("Unable to load your data.");
      }
    } finally {
      setLoading(false);
    }
  }, [accountStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (accountStatus === "PENDING_APPROVAL" || accountStatus === "REJECTED") {
    return (
      <div className="space-y-7">
        <div>
          <p className="text-sm font-semibold text-emerald-600">MediCare</p>
          <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">Doctor Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Welcome, {user?.name || "Doctor"}.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <Clock3 className="mx-auto text-amber-600" size={48} />
          <h2 className="mt-4 text-xl font-bold text-amber-800">
            {accountStatus === "REJECTED"
              ? "Account Not Approved"
              : "Account Pending Approval"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-amber-700">
            {accountStatus === "REJECTED"
              ? "Your doctor account has not been approved by the System Administrator. Please contact support for more information."
              : "Your doctor account is currently waiting for approval by the System Administrator. You will be able to access the dashboard once your account is approved."}
          </p>
        </div>
      </div>
    );
  }

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
    if (!date) {
      setError("Please select a date.");
      return;
    }
    if (date < today) {
      setError("Cannot create availability for past dates.");
      return;
    }
    if (startTime >= endTime) {
      setError("Start time must be before end time.");
      return;
    }
    try {
      await api.post("/availability/create", {
        hospitalId: hospital.id,
        date,
        startTime,
        endTime,
      });
      setSuccess("Availability saved.");
      setDate("");
      setStartTime("08:00");
      setEndTime("16:00");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save availability.");
    }
  };

  const handleDeleteAvailability = async (id) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/availability/${id}`);
      setSuccess("Availability removed.");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete availability.");
    }
  };

  const handleStartConsultation = async (appointmentId, consultationType) => {
    setError("");
    setSuccess("");
    setStartingId(appointmentId);
    try {
      await api.post(`/appointments/${appointmentId}/start`);
      setSuccess("Consultation started. Patient has been notified.");
      fetchData();
      if (consultationType === "ONLINE") {
        navigate(`/video-consultation/${appointmentId}`);
      } else {
        navigate(`/onsite-consultation/${appointmentId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to start consultation.");
    } finally {
      setStartingId(null);
    }
  };

  const handleEndConsultation = async (appointmentId) => {
    setError("");
    setSuccess("");
    setEndingId(appointmentId);
    try {
      await api.post(`/appointments/${appointmentId}/end`);
      setSuccess("Consultation ended.");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to end consultation.");
    } finally {
      setEndingId(null);
    }
  };

  const upcomingCount = appointments.filter(
    (a) => a.status === "PENDING" || a.status === "IN_PROCESS"
  ).length;

  const getStatusLabel = (status) => {
    switch (status) {
      case "DRAFT": return "Draft";
      case "PENDING": return "Pending";
      case "DISAPPROVED": return "Disapproved";
      case "CONFIRMED": return "Confirmed";
      case "RESCHEDULED": return "Rescheduled";
      case "REASSIGN": return "Reassign";
      case "IN_PROCESS": return "In Process";
      case "TERMINATED": return "Terminated";
      case "NO_SHOW": return "No Show";
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DRAFT": return "bg-slate-100 text-slate-600";
      case "PENDING": return "bg-amber-50 text-amber-700";
      case "DISAPPROVED": return "bg-red-50 text-red-700";
      case "CONFIRMED": return "bg-emerald-50 text-emerald-700";
      case "RESCHEDULED": return "bg-purple-50 text-purple-700";
      case "REASSIGN": return "bg-indigo-50 text-indigo-700";
      case "IN_PROCESS": return "bg-blue-50 text-blue-700";
      case "TERMINATED": return "bg-gray-100 text-gray-600";
      case "NO_SHOW": return "bg-red-50 text-red-700";
      default: return "bg-emerald-50 text-emerald-700";
    }
  };

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
          <p className="mt-5 text-sm text-gray-500">Availability Entries</p>
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
          <p className="mt-1 text-sm text-gray-500">Set when you are available for appointments on specific dates.</p>

          {hospital && (
            <p className="mt-2 text-xs text-emerald-700">Hospital: <span className="font-semibold">{hospital.name}</span></p>
          )}

          <form onSubmit={handleAddAvailability} className="mt-4 space-y-3">
            <label className="block text-xs font-medium text-slate-700">
              Date
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
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
                      <span className="font-semibold">{a.date}</span> {a.startTime} - {a.endTime}
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
                    <p className="text-emerald-700 font-medium">{a.consultationType === 'ONLINE' ? 'Online Consultation' : 'On-site Consultation'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                      <button
                        onClick={() => handleStartConsultation(a.id, a.consultationType)}
                        disabled={startingId === a.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        <Play size={12} /> {startingId === a.id ? 'Starting...' : 'Start'}
                      </button>
                    )}
                    {a.status === "IN_PROCESS" && a.consultationType === "ONLINE" && (
                      <>
                        <Link to={`/video-consultation/${a.id}`} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700"><Video size={12} /> Join</Link>
                        <button
                          onClick={() => handleEndConsultation(a.id)}
                          disabled={endingId === a.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                          <StopCircle size={12} /> {endingId === a.id ? 'Ending...' : 'End'}
                        </button>
                      </>
                    )}
                    {a.status === "IN_PROCESS" && a.consultationType === "ON_SITE" && (
                      <>
                        <Link to={`/onsite-consultation/${a.id}`} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700"><FileText size={12} /> Open</Link>
                        <button
                          onClick={() => handleEndConsultation(a.id)}
                          disabled={endingId === a.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                          <StopCircle size={12} /> {endingId === a.id ? 'Ending...' : 'End'}
                        </button>
                      </>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusColor(a.status)}`}>{getStatusLabel(a.status)}</span>
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
