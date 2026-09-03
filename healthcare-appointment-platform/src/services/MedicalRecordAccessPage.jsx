import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Shield, ShieldCheck, ShieldX, UserCheck, UserX, XCircle } from "lucide-react";
import api from "./api.js";

function DoctorAccessCard({ access, onAuthorize, onRevoke, loading }) {
  const doctor = access.doctor;
  const hospital = doctor?.memberships?.[0]?.hospital;
  const isAuthorized = access.authorized;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isAuthorized ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
            {isAuthorized ? <ShieldCheck size={23} /> : <Shield size={23} />}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Dr. {doctor?.name || "Unknown"}
            </h3>
            <p className="text-sm text-gray-500">
              {doctor?.specialty || "General Medicine"}
            </p>
            <p className="text-xs text-gray-400">
              {hospital?.name || "Hospital not specified"}
            </p>
            {isAuthorized && (
              <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Access Authorized
              </span>
            )}
            {!isAuthorized && (
              <span className="mt-2 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Awaiting Authorization
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {!isAuthorized ? (
            <button
              disabled={loading === access.id}
              onClick={() => onAuthorize(doctor.id)}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading === access.id ? "Processing..." : "Authorize Access"}
            </button>
          ) : (
            <button
              disabled={loading === access.id}
              onClick={() => onRevoke(doctor.id)}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              {loading === access.id ? "Processing..." : "Revoke Access"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MedicalRecordAccessPage() {
  const [accesses, setAccesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAccesses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/medical-record-access");
      setAccesses(response.data?.accesses || []);
    } catch (err) {
      console.error("Fetch access requests error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load medical record access requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccesses();
  }, [fetchAccesses]);

  const authorizeDoctor = async (doctorId) => {
    try {
      setActionLoading(doctorId);
      setError("");
      setSuccess("");

      await api.post(`/medical-record-access/${doctorId}/authorize`);
      setSuccess("Doctor authorized successfully.");
      fetchAccesses();
    } catch (err) {
      console.error("Authorize doctor error:", err);
      setError(
        err.response?.data?.message || "Unable to authorize this doctor."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const revokeDoctor = async (doctorId) => {
    if (!window.confirm("Are you sure you want to revoke this doctor's access to your medical records?")) {
      return;
    }

    try {
      setActionLoading(doctorId);
      setError("");
      setSuccess("");

      await api.patch(`/medical-record-access/${doctorId}/revoke`);
      setSuccess("Doctor access revoked successfully.");
      fetchAccesses();
    } catch (err) {
      console.error("Revoke doctor error:", err);
      setError(
        err.response?.data?.message || "Unable to revoke this doctor's access."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = accesses.filter((a) => !a.authorized).length;
  const authorizedCount = accesses.filter((a) => a.authorized).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-600">Medical Records</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">
          Medical Record Access
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage which doctors can access your medical records.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary icon={Shield} label="Total Requests" value={accesses.length} />
        <Summary icon={ShieldCheck} label="Authorized" value={authorizedCount} />
        <Summary icon={UserCheck} label="Pending" value={pendingCount} />
        <Summary icon={ShieldX} label="Revoked" value="—" />
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
              Doctor Access Requests
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Doctors who need access to your medical records.
            </p>
          </div>

          <button
            onClick={fetchAccesses}
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
          ) : accesses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <Shield className="mx-auto text-gray-400" size={38} />
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Access Requests
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                You have no doctor access requests at this time. Doctors you authorize will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {accesses.map((access) => (
                <DoctorAccessCard
                  key={access.id}
                  access={access}
                  onAuthorize={authorizeDoctor}
                  onRevoke={revokeDoctor}
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
