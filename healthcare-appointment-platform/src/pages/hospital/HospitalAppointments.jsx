import { useEffect, useState, useCallback } from "react";
import { CalendarDays, Clock3, User, Video } from "lucide-react";
import api from "../../services/api.js";

export default function HospitalAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/hospitals/my-hospital/appointments");
      setAppointments(response.data?.data || []);
    } catch {
      setError("Unable to load appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#152420]">Hospital Appointments</h1>
        <p className="mt-1 text-sm text-gray-500">All appointments at your hospital.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>
      )}

      {loading && (
        <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">Loading appointments...</div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">No appointments found.</div>
      )}

      {!loading && appointments.length > 0 && (
        <div className="space-y-3">
          {appointments.map((item) => (
            <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.patient?.name || "Patient"}</p>
                    <p className="text-sm text-gray-500">Doctor: {item.doctor?.name || "Doctor"}{item.doctor?.specialty ? ` • ${item.doctor.specialty}` : ""}</p>
                    <p className="mt-1 text-xs text-emerald-700 font-medium">{item.consultationType === 'ONLINE' ? 'Online' : 'On-site'}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-600">
                      <span className="inline-flex items-center gap-1"><CalendarDays size={12} />{item.appointmentDate}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 size={12} />{item.appointmentTime} - {item.endTime || ''}</span>
                    </div>
                  </div>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(item.status)}`}>{getStatusLabel(item.status)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
