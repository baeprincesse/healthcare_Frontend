import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, Shield, ShieldCheck, ShieldX, Clock, XCircle } from "lucide-react";
import api from "./api.js";
import MedicalRecordAccessRequestCard from "../components/cards/MedicalRecordAccessRequestCard.jsx";

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

      const response = await api.get("/medical-record-access/requests");
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

  const respond = async (requestId, decision, successMessage) => {
    try {
      setActionLoading(requestId);
      setError("");
      setSuccess("");

      await api.post(`/medical-record-access/requests/${requestId}/${decision}`);
      setSuccess(successMessage);
      await fetchAccesses();
    } catch (err) {
      console.error(`${decision} access request error:`, err);
      setError(
        err.response?.data?.message ||
          `Unable to ${decision} this access request.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const acceptRequest = (requestId) =>
    respond(
      requestId,
      "accept",
      "Access granted. The doctor can now view your medical records for this appointment."
    );

  const rejectRequest = (requestId) =>
    respond(
      requestId,
      "reject",
      "Access rejected. The doctor will not be able to view your medical records."
    );

  const revokeAccess = async (doctorId) => {
    if (!window.confirm("Are you sure you want to revoke this doctor's access to your medical records?")) {
      return;
    }

    try {
      setActionLoading(doctorId);
      setError("");
      setSuccess("");

      await api.patch(`/medical-record-access/${doctorId}/revoke`);
      setSuccess("Doctor access revoked successfully.");
      await fetchAccesses();
    } catch (err) {
      console.error("Revoke doctor error:", err);
      setError(
        err.response?.data?.message || "Unable to revoke this doctor's access."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const counts = useMemo(
    () => ({
      total: accesses.length,
      pending: accesses.filter((access) => !access.authorized && !access.rejected).length,
      accepted: accesses.filter((access) => access.authorized).length,
      rejected: accesses.filter((access) => access.rejected).length,
    }),
    [accesses]
  );

  const pendingRequests = accesses.filter((access) => !access.authorized && !access.rejected);
  const otherRequests = accesses.filter((access) => access.authorized || access.rejected);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-600">Medical Records</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">
          Medical Record Access Requests
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Doctors must ask before they can view your medical records. Accept or reject each request below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary icon={Shield} label="Total Requests" value={counts.total} />
        <Summary icon={Clock} label="Pending" value={counts.pending} />
        <Summary icon={ShieldCheck} label="Authorized" value={counts.accepted} />
        <Summary icon={ShieldX} label="Rejected" value={counts.rejected} />
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
              Pending Requests
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Doctors waiting for your decision.
            </p>
          </div>

          <button
            onClick={fetchAccesses}
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
          ) : pendingRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <Shield className="mx-auto text-gray-400" size={38} />
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Pending Requests
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                You have no doctor access requests waiting for your decision.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((access) => (
                <MedicalRecordAccessRequestCard
                  key={access.id}
                  access={access}
                  onAccept={acceptRequest}
                  onReject={rejectRequest}
                  busy={actionLoading === access.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {otherRequests.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-gray-900">
            Previous Decisions
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Doctors you have authorized or rejected. You can revoke an authorization at any time.
          </p>

          <div className="mt-6 space-y-4">
            {otherRequests.map((access) => (
              <MedicalRecordAccessRequestCard
                key={access.id}
                access={access}
                onAccept={acceptRequest}
                onReject={rejectRequest}
                onRevoke={revokeAccess}
                busy={actionLoading === access.id || actionLoading === access.doctorId}
              />
            ))}
          </div>
        </section>
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
