import {
  Download,
  FileText,
  Pill,
  Search,
  CalendarDays,
  UserRound,
} from "lucide-react";
import { useState } from "react";

export default function Prescription() {
  const [search, setSearch] = useState("");

  const prescriptions = [
    {
      id: 1,
      medicine: "Amoxicillin 500mg",
      dosage: "1 capsule, 3 times daily",
      duration: "7 days",
      doctor: "Dr. Sarah Johnson",
      hospital: "MediCare General Hospital",
      date: "Aug 18, 2026",
      status: "Active",
    },
    {
      id: 2,
      medicine: "Paracetamol 500mg",
      dosage: "1 tablet when needed",
      duration: "5 days",
      doctor: "Dr. Michael Brown",
      hospital: "City Medical Center",
      date: "Aug 10, 2026",
      status: "Completed",
    },
    {
      id: 3,
      medicine: "Vitamin D 1000 IU",
      dosage: "1 tablet daily",
      duration: "30 days",
      doctor: "Dr. Emily Wilson",
      hospital: "MediCare Clinic",
      date: "Aug 05, 2026",
      status: "Active",
    },
  ];

  const filtered = prescriptions.filter((item) =>
    item.medicine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Prescriptions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage your medical prescriptions.
          </p>
        </div>

        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search medicine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-64"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
              <Pill size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Total Prescriptions</p>
              <p className="text-xl font-bold text-slate-900">12</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
              <FileText size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Active</p>
              <p className="text-xl font-bold text-slate-900">3</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
              <CalendarDays size={20} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Last Prescription</p>
              <p className="text-sm font-bold text-slate-900">
                Aug 18, 2026
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Prescription list */}
      <div className="space-y-4">

        {filtered.map((prescription) => (
          <div
            key={prescription.id}
            className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div className="flex gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Pill size={23} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-slate-900">
                      {prescription.medicine}
                    </h2>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        prescription.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {prescription.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {prescription.dosage}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Duration: {prescription.duration}
                  </p>
                </div>

              </div>

              <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-600">
                <Download size={15} />
                Download
              </button>

            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">

              <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">

                <div className="flex items-center gap-2 text-slate-500">
                  <UserRound size={15} />
                  <span>{prescription.doctor}</span>
                </div>

                <div className="text-slate-500">
                  <span className="font-medium text-slate-700">
                    Hospital:
                  </span>{" "}
                  {prescription.hospital}
                </div>

                <div className="text-slate-500 sm:text-right">
                  {prescription.date}
                </div>

              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}