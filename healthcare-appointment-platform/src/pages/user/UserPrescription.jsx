import {
  Download,
  FileText,
  Pill,
  Search,
  CalendarDays,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api.js";

export default function Prescription() {
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/medical-records/patient");
        const all = res.data?.records || res.data?.data || [];
        setRecords(all.filter((r) => r.prescription));
      } catch {
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = records.filter((r) =>
    (r.prescription || "").toLowerCase().includes(search.toLowerCase())
  );

  const lastDate = records[0]?.appointment?.appointmentDate
    || (records[0] ? new Date(records[0].createdAt).toLocaleDateString() : "—");

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage your medical prescriptions.
          </p>
        </div>

        <div className="relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search prescription..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-64"
          />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
              <Pill size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Prescriptions</p>
              <p className="text-xl font-bold text-slate-900">{records.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Last Prescription</p>
              <p className="text-sm font-bold text-slate-900">{lastDate}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500">This Month</p>
              <p className="text-xl font-bold text-slate-900">{records.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm">Loading prescriptions...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm">No prescriptions yet.</div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Pill size={23} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">{r.prescription}</h2>
                    {r.diagnosis && (
                      <p className="mt-1 text-sm text-slate-500">Diagnosis: {r.diagnosis}</p>
                    )}
                    {r.treatment && (
                      <p className="mt-1 text-xs text-slate-400">Treatment: {r.treatment}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <UserRound size={15} />
                    <span>{r.doctor?.name || "Doctor"}</span>
                  </div>
                  <div className="text-slate-500">
                    <span className="font-medium text-slate-700">Specialty:</span> {r.doctor?.specialty || "—"}
                  </div>
                  <div className="text-slate-500 sm:text-right">
                    {r.appointment?.appointmentDate || new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
