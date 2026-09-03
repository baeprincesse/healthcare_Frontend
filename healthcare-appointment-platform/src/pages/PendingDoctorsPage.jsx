import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock3, Stethoscope, UserCheck, UserX, XCircle } from "lucide-react";
import api from "../services/api.js";

function DoctorCard({ doctor, actionLoading, onApprove, onReject }) {
  const busy = actionLoading === doctor.id;
  const hospital = doctor.memberships?.[0]?.hospital;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-5 lg:flex-row">
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Stethoscope size={23} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-gray-900">
                Dr. {doctor.name}
              </h3>
              <span className="mt-1 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Pending Approval
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-2 text-sm text-gray-600">
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Specialty:</strong> {doctor.specialty || "Not specified"}</p>
            <p><strong>Registration Number:</strong> {doctor.professionalRegistrationNumber || "N/A"}</p>
            <p><strong>Hospital:</strong> {hospital?.name || "N/A"}</p>
            <p><strong>Registration Date:</strong> {new Date(doctor.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
          <button
            disabled={busy}
            onClick={() => onApprove(doctor.id)}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {busy ? "Processing..." : "Approve"}
          </button>

          <button
            disabled={busy}
            onClick={() => onReject(doctor.id)}
            className="rounded-xl bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PendingDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/doctor-approval/pending");
      setDoctors(response.data?.doctors || []);
    } catch (err) {
      console.error("Fetch pending doctors error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load pending doctor registrations."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const approveDoctor = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await api.patch(`/doctor-approval/${id}/approve`);
      setDoctors((current) => current.filter((doctor) => doctor.id !== id));
    } catch (err) {
      console.error("Approve doctor error:", err);
      setError(
        err.response?.data?.message || "Unable to approve this doctor."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const rejectDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to reject this doctor?")) {
      return;
    }

    try {
      setActionLoading(id);
      setError("");

      await api.patch(`/doctor-approval/${id}/reject`);
      setDoctors((current) => current.filter((doctor) => doctor.id !== id));
    } catch (err) {
      console.error("Reject doctor error:", err);
      setError(
        err.response?.data?.message || "Unable to reject this doctor."
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
          Pending Doctor Registrations
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Review and approve or reject doctor registration requests.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary icon={Clock3} label="Pending Doctors" value={doctors.length} />
        <Summary icon={Stethoscope} label="Total Doctors" value="—" />
        <Summary icon={UserCheck} label="Approved" value="—" />
        <Summary icon={UserX} label="Rejected" value="—" />
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
              Doctor Registration Requests
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Verify doctor credentials before granting platform access.
            </p>
          </div>

          <button
            onClick={fetchDoctors}
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
          ) : doctors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <CheckCircle2 className="mx-auto text-emerald-600" size={38} />
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Pending Doctors
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                There are currently no doctor registration requests waiting for approval.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  actionLoading={actionLoading}
                  onApprove={approveDoctor}
                  onReject={rejectDoctor}
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
