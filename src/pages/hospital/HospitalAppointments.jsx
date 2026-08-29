import { useEffect, useState, useCallback } from "react";
import { CalendarDays, Clock3, User } from "lucide-react";
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
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-600">
                      <span className="inline-flex items-center gap-1"><CalendarDays size={12} />{item.appointmentDate}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 size={12} />{item.appointmentTime}</span>
                    </div>
                  </div>
                </div>
                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

