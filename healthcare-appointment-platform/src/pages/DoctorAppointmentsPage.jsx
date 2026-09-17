import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Clock3, MapPin, Video, Play, StopCircle, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api.js";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startingId, setStartingId] = useState(null);
  const [endingId, setEndingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/appointments/my");
      setAppointments(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStartConsultation = async (appointmentId, consultationType) => {
    setError("");
    setStartingId(appointmentId);
    try {
      await api.post(`/appointments/${appointmentId}/start`);
      fetchAppointments();
      if (consultationType === "ONLINE") {
        window.location.href = `/fronted/healthcare-appointment-platform/video-consultation/${appointmentId}`;
      } else {
        window.location.href = `/fronted/healthcare-appointment-platform/onsite-consultation/${appointmentId}`;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to start consultation.");
    } finally {
      setStartingId(null);
    }
  };

  const handleEndConsultation = async (appointmentId) => {
    setError("");
    setEndingId(appointmentId);
    try {
      await api.post(`/appointments/${appointmentId}/end`);
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to end consultation.");
    } finally {
      setEndingId(null);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING": return "Pending";
      case "CONFIRMED": return "Confirmed";
      case "IN_PROCESS": return "In Process";
      case "TERMINATED": return "Terminated";
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-700";
      case "CONFIRMED": return "bg-emerald-50 text-emerald-700";
      case "IN_PROCESS": return "bg-blue-50 text-blue-700";
      case "TERMINATED": return "bg-gray-100 text-gray-600";
      default: return "bg-emerald-50 text-emerald-700";
    }
  };

  const pendingCount = appointments.filter((a) => a.status === "PENDING" || a.status === "CONFIRMED").length;
  const inProcessCount = appointments.filter((a) => a.status === "IN_PROCESS").length;
  const terminatedCount = appointments.filter((a) => a.status === "TERMINATED").length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-600">Appointments</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">
          My Appointments
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your appointments and consultations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary icon={CalendarDays} label="Total" value={appointments.length} />
        <Summary icon={Clock3} label="Pending" value={pendingCount} />
        <Summary icon={Loader2} label="In Process" value={inProcessCount} />
        <Summary icon={StopCircle} label="Completed" value={terminatedCount} />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              All Appointments
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              All appointments booked with you.
            </p>
          </div>

          <button
            onClick={fetchAppointments}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-14">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <CalendarDays className="mx-auto text-gray-400" size={38} />
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Appointments
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                You have no appointments yet. Patients will appear here when they book appointments with you.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((a) => (
                <div key={a.id} className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-bold">{a.patient?.name || "Patient"}</h2>
                      <p className="text-sm text-[#6E7B76]">{a.patient?.email || ""}</p>
                      <p className="mt-1 text-xs text-emerald-700 font-medium">
                        {a.consultationType === "ONLINE" ? "Online Consultation" : "On-site Consultation"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#6E7B76]">
                        <span><CalendarDays size={13} className="mr-1 inline" />{a.appointmentDate}</span>
                        <span><Clock3 size={13} className="mr-1 inline" />{a.appointmentTime} - {a.endTime || ""}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                        <button
                          onClick={() => handleStartConsultation(a.id, a.consultationType)}
                          disabled={startingId === a.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          <Play size={13} /> {startingId === a.id ? "Starting..." : "Start"}
                        </button>
                      )}
                      {a.status === "IN_PROCESS" && a.consultationType === "ONLINE" && (
                        <>
                          <Link to={`/video-consultation/${a.id}`} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"><Video size={13} /> Join</Link>
                          <button
                            onClick={() => handleEndConsultation(a.id)}
                            disabled={endingId === a.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            <StopCircle size={13} /> {endingId === a.id ? "Ending..." : "End"}
                          </button>
                        </>
                      )}
                      {a.status === "IN_PROCESS" && a.consultationType === "ON_SITE" && (
                        <>
                          <Link to={`/onsite-consultation/${a.id}`} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"><FileText size={13} /> Open</Link>
                          <button
                            onClick={() => handleEndConsultation(a.id)}
                            disabled={endingId === a.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            <StopCircle size={13} /> {endingId === a.id ? "Ending..." : "End"}
                          </button>
                        </>
                      )}
                      <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(a.status)}`}>{getStatusLabel(a.status)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Summary({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-5 text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-gray-900">{value}</p>
    </div>
  );
}
