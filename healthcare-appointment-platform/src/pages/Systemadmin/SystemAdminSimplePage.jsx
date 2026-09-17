import { useAuth } from "../../context/AuthContext.jsx";
import { useCallback, useEffect, useState } from "react";
import { Building2, RefreshCw, Users, Search, CheckCircle2, XCircle } from "lucide-react";
import api from "../../services/api.js";

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
  const [data, setData] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(section !== "profile");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = useCallback(async () => {
    if (section === "profile") return;
    try {
      setLoading(true);
      setError("");
      if (section === "settings") {
        const response = await api.get("/platform-admin/settings");
        setSettings(response.data?.settings || null);
      } else {
        const response = await api.get(`/platform-admin/${section}`);
        setData(section === "users" ? response.data?.users || [] : response.data?.hospitals || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Unable to load ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [section, title]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateUserStatus = async (userId, accountStatus) => {
    try {
      setActionLoading(userId);
      setError("");
      await api.patch(`/platform-admin/users/${userId}/status`, { accountStatus });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update this user account.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = data.filter((item) => {
    const matchesQuery = `${item.name} ${item.email} ${item.phone || ""}`.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "all" || item.role === roleFilter;
    const matchesStatus = statusFilter === "all" || (item.accountStatus || "ACTIVE") === statusFilter;
    return matchesQuery && matchesRole && matchesStatus;
  });

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
        ) : loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading live platform data...</div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">{error}</div>
        ) : section === "settings" ? (
          <div className="space-y-4">
            {Object.entries(settings || {}).map(([label, value]) => <Info key={label} label={label.replace(/([A-Z])/g, " $1")} value={value} />)}
            <button onClick={fetchData} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"><RefreshCw size={15} /> Refresh</button>
          </div>
        ) : section === "hospitals" ? (
          <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-3">Hospital</th><th className="p-3">Location</th><th className="p-3">Contact</th><th className="p-3">Status</th></tr></thead><tbody>{data.map((hospital) => <tr key={hospital.id} className="border-t border-gray-100"><td className="p-3 font-semibold"><Building2 size={15} className="mr-2 inline text-emerald-600" />{hospital.name}</td><td className="p-3">{hospital.city || hospital.address || "—"}</td><td className="p-3">{hospital.email || hospital.phone || "—"}</td><td className="p-3"><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{hospital.status}</span></td></tr>)}</tbody></table>{data.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No hospitals found.</p>}</div>
        ) : (
          <div>
            <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
              <label className="relative block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email or phone" className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500" /></label>
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm"><option value="all">All roles</option><option value="patient">Patients</option><option value="doctor">Doctors</option><option value="hospital_admin">Hospital admins</option><option value="secretary">Secretaries</option><option value="system_admin">System admins</option></select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm"><option value="all">All statuses</option><option value="APPROVED">Approved</option><option value="PENDING_APPROVAL">Pending</option><option value="REJECTED">Rejected</option><option value="ACTIVE">Active</option></select>
              <button onClick={fetchData} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"><RefreshCw size={15} /> Refresh</button>
            </div>
              <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Specialty</th><th className="p-3">Status</th><th className="p-3">Created</th><th className="p-3">Actions</th></tr></thead><tbody>{filteredUsers.map((item) => <tr key={item.id} className="border-t border-gray-100"><td className="p-3"><Users size={15} className="mr-2 inline text-emerald-600" /><span className="font-semibold">{item.name}</span><span className="block text-xs text-gray-500">{item.email}</span><span className="block text-xs text-gray-400">{item.phone}</span></td><td className="p-3">{item.role}</td><td className="p-3">{item.specialty || "—"}</td><td className="p-3">{item.accountStatus || "Active"}</td><td className="p-3">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</td><td className="p-3">{["doctor", "hospital_admin"].includes(item.role) && <div className="flex gap-2">{item.accountStatus !== "APPROVED" && <button disabled={actionLoading === item.id} onClick={() => updateUserStatus(item.id, "APPROVED")} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"><CheckCircle2 size={13} /> Approve</button>}{item.accountStatus !== "REJECTED" && <button disabled={actionLoading === item.id} onClick={() => updateUserStatus(item.id, "REJECTED")} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"><XCircle size={13} /> Reject</button>}</div>}</td></tr>)}</tbody></table>{filteredUsers.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No users match the selected filters.</p>}</div>
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
