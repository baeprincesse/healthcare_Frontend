import { useCallback, useEffect, useState } from "react";
import { Building2, CheckCircle2, Clock3, Users, XCircle } from "lucide-react";
import api from "../services/api.js";

function HospitalRequestCard({ hospital, actionLoading, onApprove, onReject }) {
  const busy = actionLoading === hospital.id;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-5 lg:flex-row">
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Building2 size={23} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-gray-900">
                {hospital.name}
              </h3>
              <span className="mt-1 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Pending Review
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-2 text-sm text-gray-600">
            <p><strong>Address:</strong> {hospital.address || "Not provided"}</p>
            <p><strong>Phone:</strong> {hospital.phone || "Not provided"}</p>
            <p><strong>Email:</strong> {hospital.email || "Not provided"}</p>
            <p><strong>Description:</strong> {hospital.description || "No description provided"}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
          <button
            disabled={busy}
            onClick={() => onApprove(hospital.id)}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {busy ? "Processing..." : "Approve"}
          </button>

          <button
            disabled={busy}
            onClick={() => onReject(hospital.id)}
            className="rounded-xl bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlatformAdminDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchHospitals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/platform-admin/hospitals/pending");
      setHospitals(response.data?.hospitals || []);
    } catch {
      console.error("Platform admin hospital request error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load hospital registration requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  const approveHospital = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await api.put(`/platform-admin/hospitals/${id}/approve`);
      setHospitals((current) => current.filter((hospital) => hospital.id !== id));
    } catch {
      console.error("Approve hospital error:", err);
      setError(
        err.response?.data?.message || "Unable to approve this hospital."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const rejectHospital = async (id) => {
    if (!window.confirm("Are you sure you want to reject this hospital?")) {
      return;
    }

    try {
      setActionLoading(id);
      setError("");

      await api.put(`/platform-admin/hospitals/${id}/reject`);
      setHospitals((current) => current.filter((hospital) => hospital.id !== id));
    } catch {
      console.error("Reject hospital error:", err);
      setError(
        err.response?.data?.message || "Unable to reject this hospital."
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-600">
          System Administration
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">
          Platform Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Review hospital registration requests and supervise the MediCare platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary icon={Clock3} label="Pending Requests" value={hospitals.length} />
        <Summary icon={Building2} label="Hospitals" value="—" />
        <Summary icon={Users} label="Users" value="—" />
        <Summary icon={CheckCircle2} label="Platform Status" value="Active" />
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <XCircle size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Request error</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Hospital Registration Requests
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Verify the submitted information before approving a hospital.
            </p>
          </div>

          <button
            onClick={fetchHospitals}
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
          ) : hospitals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <CheckCircle2 className="mx-auto text-emerald-600" size={38} />
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Pending Hospitals
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                There are currently no hospital registration requests waiting for approval.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {hospitals.map((hospital) => (
                <HospitalRequestCard
                  key={hospital.id}
                  hospital={hospital}
                  actionLoading={actionLoading}
                  onApprove={approveHospital}
                  onReject={rejectHospital}
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

