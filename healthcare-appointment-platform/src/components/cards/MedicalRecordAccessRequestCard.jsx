import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  ShieldX,
  Stethoscope,
  XCircle,
} from "lucide-react";

const STATUS_STYLES = {
  PENDING: {
    label: "Pending your decision",
    className: "bg-amber-50 text-amber-700",
    Icon: Clock,
  },
  ACCEPTED: {
    label: "Access granted",
    className: "bg-emerald-50 text-emerald-700",
    Icon: ShieldCheck,
  },
  REJECTED: {
    label: "Access rejected",
    className: "bg-red-50 text-red-600",
    Icon: ShieldX,
  },
};

function formatAppointmentDate(value) {
  if (!value) return null;

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatAppointmentTime(value) {
  if (!value) return null;

  const [rawHours, rawMinutes] = String(value).split(":");
  const hours = Number(rawHours);
  if (Number.isNaN(hours)) return String(value);

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(rawMinutes ?? "00").padStart(2, "0");

  return `${displayHours}:${minutes} ${period}`;
}

export default function MedicalRecordAccessRequestCard({ access, onAccept, onReject, onRevoke, busy }) {
  const doctor = access.doctor;
  const hospital = doctor?.memberships?.[0]?.hospital;
  const appointment = access.appointment;
  const isPending = access.status === "PENDING";
  const isAccepted = access.status === "ACCEPTED";
  const status = STATUS_STYLES[access.status] || STATUS_STYLES.PENDING;
  const StatusIcon = status.Icon;

  const appointmentDate = formatAppointmentDate(appointment?.appointmentDate);
  const appointmentTime = formatAppointmentTime(appointment?.appointmentTime);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              isAccepted ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            <FileText size={23} />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900">
              Dr. {doctor?.name || "Unknown doctor"}
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <Stethoscope size={14} />
              {doctor?.specialty || "General Medicine"}
            </p>

            {hospital?.name && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <Building2 size={14} />
                {hospital.name}
              </p>
            )}

            {appointment && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <CalendarDays size={14} />
                {appointmentDate}
                {appointmentTime ? ` — ${appointmentTime}` : ""}
              </p>
            )}

            <p className="mt-1 text-xs text-gray-400">
              Requested {new Date(access.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <span
              className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
            >
              <StatusIcon size={14} /> {status.label}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {isPending && (
            <>
              <button
                disabled={busy}
                onClick={() => onAccept(access.id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                {busy ? "Processing..." : "Accept"}
              </button>

              <button
                disabled={busy}
                onClick={() => onReject(access.id)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                <XCircle size={16} />
                Reject
              </button>
            </>
          )}

          {isAccepted && onRevoke && (
            <button
              disabled={busy}
              onClick={() => onRevoke(access.doctorId)}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              {busy ? "Processing..." : "Revoke Access"}
            </button>
          )}
        </div>
      </div>

      {isPending && (
        <p className="mt-4 rounded-xl bg-[#F5F7F6] p-3 text-xs leading-5 text-[#6E7B76]">
          This doctor is requesting access to your medical records for this care relationship. If you
          accept, they will be able to view your history and add records and prescriptions during the
          consultation.
        </p>
      )}
    </div>
  );
}
