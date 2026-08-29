import { useEffect, useState, useCallback } from "react";
import { Users, Mail, Phone } from "lucide-react";
import api from "../../services/api.js";

export default function HospitalStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/hospitals/my-hospital/staff");
      setStaff(response.data?.data || []);
    } catch {
      setError("Unable to load staff members.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#152420]">Hospital Staff</h1>
        <p className="mt-1 text-sm text-gray-500">All staff members associated with your hospital.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>
      )}

      {loading && (
        <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">Loading staff...</div>
      )}

      {!loading && !error && staff.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">No staff members found.</div>
      )}

      {!loading && staff.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <div key={member.id + "-" + member.memberRole} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                  {(member.name || "").split(" ").map((x) => x[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.memberRole}{member.specialty ? ` • ${member.specialty}` : ""}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs text-gray-500">
                {member.email && (
                  <p className="flex items-center gap-2 truncate"><Mail size={13} className="shrink-0" /><span className="truncate">{member.email}</span></p>
                )}
                {member.phone && (
                  <p className="flex items-center gap-2"><Phone size={13} className="shrink-0" />{member.phone}</p>
                )}
              </div>
              <div className="mt-3">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${member.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                  {member.status || "active"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

