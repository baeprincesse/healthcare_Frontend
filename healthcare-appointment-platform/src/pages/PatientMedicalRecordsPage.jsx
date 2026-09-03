import { useCallback, useEffect, useState } from "react";
import { Calendar, Download, Eye, FileText, Stethoscope, XCircle } from "lucide-react";
import api from "../services/api.js";

function MedicalRecordCard({ record, onView }) {
  const doctor = record.doctor;
  const hospital = doctor?.memberships?.[0]?.hospital;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <FileText size={23} />
          </div>

          <div>
            <p className="text-xs text-gray-400">
              {new Date(record.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h3 className="mt-1 text-lg font-bold text-gray-900">
              Dr. {doctor?.name || "Unknown"}
            </h3>
            <p className="text-sm text-gray-500">
              {doctor?.specialty || "General Medicine"}
            </p>
            <p className="text-xs text-gray-400">
              {hospital?.name || "Hospital not specified"}
            </p>
            {record.diagnosis && (
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Diagnosis:</span> {record.diagnosis.substring(0, 100)}
                {record.diagnosis.length > 100 ? "..." : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => onView(record)}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Eye size={16} className="mr-1 inline" />
            View
          </button>
          <a
            href={`http://localhost:3000/api/medical-records/${record.id}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Download size={16} className="mr-1 inline" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

function RecordDetailModal({ record, onClose }) {
  const doctor = record.doctor;
  const hospital = doctor?.memberships?.[0]?.hospital;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Medical Record</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-400">Patient</p>
              <p className="font-semibold text-gray-900">{record.patient?.name || "You"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Doctor</p>
              <p className="font-semibold text-gray-900">Dr. {doctor?.name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Specialty</p>
              <p className="font-semibold text-gray-900">{doctor?.specialty || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Hospital</p>
              <p className="font-semibold text-gray-900">{hospital?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(record.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {record.diagnosis && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Diagnosis</p>
              <p className="mt-1 text-sm text-gray-700">{record.diagnosis}</p>
            </div>
          )}

          {record.symptoms && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Symptoms</p>
              <p className="mt-1 text-sm text-gray-700">{record.symptoms}</p>
            </div>
          )}

          {record.observations && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Observations</p>
              <p className="mt-1 text-sm text-gray-700">{record.observations}</p>
            </div>
          )}

          {record.treatment && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Treatment</p>
              <p className="mt-1 text-sm text-gray-700">{record.treatment}</p>
            </div>
          )}

          {record.prescription && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Prescription</p>
              <p className="mt-1 text-sm text-gray-700">{record.prescription}</p>
            </div>
          )}

          {record.doctorNotes && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Doctor's Notes</p>
              <p className="mt-1 text-sm text-gray-700">{record.doctorNotes}</p>
            </div>
          )}

          {record.recommendations && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Recommendations</p>
              <p className="mt-1 text-sm text-gray-700">{record.recommendations}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <a
            href={`http://localhost:3000/api/medical-records/${record.id}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Download size={16} className="mr-1 inline" />
            Download
          </a>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatientMedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/medical-records/patient");
      setRecords(response.data?.records || []);
    } catch (err) {
      console.error("Fetch medical records error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load your medical records."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-600">Medical Records</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">
          My Medical Records
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          View and download your medical records from consultations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary icon={FileText} label="Total Records" value={records.length} />
        <Summary icon={Stethoscope} label="Consultations" value={records.length} />
        <Summary icon={Calendar} label="Last Record" value={records.length > 0 ? new Date(records[0].createdAt).toLocaleDateString() : "—"} />
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <XCircle size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Medical History
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your complete medical record history from all consultations.
            </p>
          </div>

          <button
            onClick={fetchRecords}
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
          ) : records.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <FileText className="mx-auto text-gray-400" size={38} />
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Medical Records
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                You have no medical records yet. Records will appear here after your consultations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <MedicalRecordCard
                  key={record.id}
                  record={record}
                  onView={setSelectedRecord}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedRecord && (
        <RecordDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
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
