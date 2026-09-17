import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Save, XCircle } from "lucide-react";
import api from "../../services/api.js";

const initialForm = {
  dateOfBirth: "",
  sex: "",
  bloodGroup: "",
  familyMedicalHistory: "",
  allergies: "",
  existingConditions: "",
  currentMedications: "",
  otherHealthInformation: "",
};

export default function Settings() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api.get("/patient-profile")
      .then((response) => setForm({ ...initialForm, ...response.data?.profile, dateOfBirth: response.data?.profile?.dateOfBirth || "" }))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load your health profile."))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.put("/patient-profile", form);
      setSuccess("Health information saved successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save your health profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]"><Loader2 className="mx-auto animate-spin text-emerald-600" /></div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div><p className="text-sm font-semibold text-emerald-600">Account Settings</p><h1 className="mt-1 text-3xl font-extrabold text-[#152420]">Settings</h1><p className="mt-2 text-sm text-[#6E7B76]">Manage your personal preferences and health information.</p></div>
      {error && <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><XCircle size={19} /><span>{error}</span></div>}
      {success && <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 size={19} /><span>{success}</span></div>}
      <form onSubmit={saveProfile} className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm sm:p-6">
        <div className="border-b border-[#E7ECE9] pb-5"><h2 className="text-xl font-bold">My Health Profile</h2><p className="mt-1 text-sm text-[#6E7B76]">Personal health information is patient-reported and can be updated at any time.</p></div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold">Date of Birth<input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={updateField} max={new Date().toISOString().slice(0, 10)} className="mt-2 w-full rounded-xl border border-[#E7ECE9] px-4 py-3 text-sm outline-none focus:border-emerald-500" /></label>
          <Select label="Sex" name="sex" value={form.sex} onChange={updateField} options={[["MALE", "Male"], ["FEMALE", "Female"], ["OTHER", "Other"], ["PREFER_NOT_TO_SAY", "Prefer not to say"]]} />
          <Select label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={updateField} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "UNKNOWN"].map((value) => [value, value === "UNKNOWN" ? "Unknown" : value])} />
        </div>
        <div className="mt-6 space-y-5">
          <TextArea label="Family Medical History" name="familyMedicalHistory" value={form.familyMedicalHistory} onChange={updateField} />
          <TextArea label="Allergies" name="allergies" value={form.allergies} onChange={updateField} />
          <TextArea label="Existing Medical Conditions" name="existingConditions" value={form.existingConditions} onChange={updateField} />
          <TextArea label="Current Medications" name="currentMedications" value={form.currentMedications} onChange={updateField} />
          <TextArea label="Other Health Information" name="otherHealthInformation" value={form.otherHealthInformation} onChange={updateField} />
        </div>
        <button type="submit" disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"><Save size={17} />{saving ? "Saving..." : "Save Health Information"}</button>
      </form>
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return <label className="text-sm font-semibold">{label}<select name={name} value={value || ""} onChange={onChange} className="mt-2 w-full rounded-xl border border-[#E7ECE9] bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"><option value="">Select {label.toLowerCase()}</option>{options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}</select></label>;
}

function TextArea({ label, name, value, onChange }) {
  return <label className="block text-sm font-semibold">{label}<textarea name={name} value={value || ""} onChange={onChange} maxLength={5000} rows={3} className="mt-2 w-full resize-y rounded-xl border border-[#E7ECE9] px-4 py-3 text-sm outline-none focus:border-emerald-500" placeholder="Optional" /></label>;
}
