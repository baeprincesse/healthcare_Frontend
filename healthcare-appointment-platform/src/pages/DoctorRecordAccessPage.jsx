import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, FileText, RefreshCw, Shield, ShieldCheck, ShieldX, UserX, XCircle } from "lucide-react";
import api from "../services/api.js";

function PatientAccessCard({ patient, onRequestAccess, loading }) {
  const getStatusBadge = () => {
    if (patient.accessStatus === "ACCEPTED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <ShieldCheck size={14} /> Authorized
        </span>
      );
    }
    if (patient.accessStatus === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          <ShieldX size={14} /> Awaiting patient approval
        </span>
      );
    }
    if (patient.accessStatus === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
          <ShieldX size={14} /> Rejected by patient
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
        <Shield size={14} /> No Access
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <FileText size={23} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {patient.name}
            </h3>
            <p className="text-sm text-gray-500">
              {patient.email}
            </p>
            <p className="text-xs text-gray-400">
              Last appointment: {patient.lastAppointment || "N/A"}
            </p>
            <div className="mt-2">
              {getStatusBadge()}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {patient.accessStatus === "PENDING" && (
            <button
              disabled
              className="rounded-xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 opacity-80"
            >
              Request Sent
            </button>
          )}

          {patient.accessStatus !== "PENDING" && patient.accessStatus !== "ACCEPTED" && (
            <button
              disabled={loading === patient.id}
              onClick={() => onRequestAccess(patient.id, patient.appointmentId)}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading === patient.id
                ? "Requesting..."
                : patient.accessStatus === "REJECTED"
                ? "Request Again"
                : "Request Access"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DoctorRecordAccessPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/medical-record-access/my-patients");
      setPatients(response.data?.patients || []);
    } catch (err) {
      console.error("Fetch patients error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load patients."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const requestAccess = async (patientId, appointmentId) => {
    try {
      setActionLoading(patientId);
      setError("");
      setSuccess("");

      await api.post("/medical-record-access/request", { patientId, appointmentId });
      setSuccess("Access request sent. The patient must approve it before you can open their records.");
      fetchPatients();
    } catch (err) {
      console.error("Request access error:", err);
      setError(
        err.response?.data?.message || "Unable to request access."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const authorizedCount = patients.filter((p) => p.accessStatus === "ACCEPTED").length;
  const pendingCount = patients.filter((p) => p.accessStatus === "PENDING").length;
  const noAccessCount = patients.filter((p) => p.accessStatus === "NONE" || p.accessStatus === "REJECTED").length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-600">Medical Records</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">
          Patient Record Access
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Request access to your patients' medical records.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary icon={FileText} label="Total Patients" value={patients.length} />
        <Summary icon={ShieldCheck} label="Authorized" value={authorizedCount} />
        <Summary icon={ShieldX} label="Pending" value={pendingCount} />
        <Summary icon={UserX} label="No Access" value={noAccessCount} />
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

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Success</p>
            <p className="mt-1">{success}</p>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              My Patients
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Patients you have appointments with. Request access to view their medical records.
            </p>
          </div>

          <button
            onClick={fetchPatients}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={16} className="mr-1 inline" />
            Refresh
          </button>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-14">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
            </div>
          ) : patients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <FileText className="mx-auto text-gray-400" size={38} />
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Patients Found
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                You have no patients yet. Patients will appear here after they book appointments with you.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {patients.map((patient) => (
                <PatientAccessCard
                  key={patient.id}
                  patient={patient}
                  onRequestAccess={requestAccess}
                  loading={actionLoading}
                />
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
