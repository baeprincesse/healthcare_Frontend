import { useAuth } from "../../context/AuthContext.jsx";

const titles = {
  requests: ["Hospital Requests", "Review and manage hospital registration requests from this platform."],
  hospitals: ["Hospitals", "View and manage hospitals registered on MediCare."],
  users: ["Manage Users", "Supervise patient, doctor, secretary and hospital administrator accounts."],
  profile: ["System Administrator Profile", "Your platform administrator account information."],
  settings: ["System Settings", "Platform-level configuration and administration settings."],
};

export default function SystemAdminSimplePage({ section }) {
  const { user } = useAuth();
  const [title, description] = titles[section] || titles.hospitals;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-600">System Administration</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {section === "profile" ? (
          <div className="space-y-4">
            <Info label="Name" value={user?.name} />
            <Info label="Email" value={user?.email} />
            <Info label="Phone" value={user?.phone} />
            <Info label="Role" value="System Administrator" />
          </div>
        ) : (
          <div className="rounded-xl bg-gray-50 p-8 text-center">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-500">
              This section is ready for the corresponding management functions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-gray-600">{value || "—"}</span>
    </div>
  );
}
