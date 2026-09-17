import { useCallback, useEffect, useState } from "react";
import { Calendar, Download, Eye, FileText, Stethoscope, UserRound, XCircle } from "lucide-react";
import api from "../services/api.js";

function PrescriptionSummary({ prescription, onDownload, downloading }) {
  if (!prescription?.items?.length) return null;

  return (
    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-emerald-900">Prescription</p>
        <button
          onClick={() => onDownload(prescription)}
          disabled={downloading}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          <Download size={13} /> {downloading ? "Preparing..." : "Download PDF"}
        </button>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[430px] text-left text-xs">
          <thead className="text-[10px] uppercase tracking-wide text-emerald-700">
            <tr><th className="pb-2 pr-3">Medication</th><th className="pb-2 pr-3">Dosage</th><th className="pb-2 pr-3">Frequency</th><th className="pb-2">Duration</th></tr>
          </thead>
          <tbody className="text-gray-700">
            {prescription.items.map((item) => (
              <tr key={item.id} className="border-t border-emerald-100">
                <td className="py-2 pr-3 font-semibold">{item.medicationName}</td>
                <td className="py-2 pr-3">{item.dosage}</td>
                <td className="py-2 pr-3">{item.frequency}</td>
                <td className="py-2">{item.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MedicalRecordCard({ record, onView, onDownload, onPrescriptionDownload, downloading, prescriptionDownloading }) {
  const doctor = record.doctor;
  const hospital = doctor?.memberships?.[0]?.hospital;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <FileText size={23} />
          </div>

          <div>
            <p className="text-xs text-gray-400">
              {new Date(record.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h3 className="mt-1 text-lg font-bold text-gray-900">
              Dr. {doctor?.name || "Unknown"}
            </h3>
            <p className="text-sm text-gray-500">
              {doctor?.specialty || "General Medicine"}
            </p>
            <p className="text-xs text-gray-400">
              {hospital?.name || "Hospital not specified"}
            </p>
            {record.diagnosis && (
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Diagnosis:</span> {record.diagnosis.substring(0, 100)}
                {record.diagnosis.length > 100 ? "..." : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => onView(record)}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Eye size={16} className="mr-1 inline" />
            View
          </button>
          <button
            onClick={() => onDownload(record)}
            disabled={downloading}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Download size={16} className="mr-1 inline" />
            {downloading ? "Preparing..." : "Download PDF"}
          </button>
        </div>
      </div>
      <PrescriptionSummary
        prescription={record.structuredPrescription}
        onDownload={onPrescriptionDownload}
        downloading={prescriptionDownloading}
      />
    </div>
  );
}

function RecordDetailModal({ record, onClose, onDownload, downloading, onPrescriptionDownload, prescriptionDownloading }) {
  const doctor = record.doctor;
  const hospital = doctor?.memberships?.[0]?.hospital;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Medical Record</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-400">Patient</p>
              <p className="font-semibold text-gray-900">{record.patient?.name || "You"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Doctor</p>
              <p className="font-semibold text-gray-900">Dr. {doctor?.name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Specialty</p>
              <p className="font-semibold text-gray-900">{doctor?.specialty || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Hospital</p>
              <p className="font-semibold text-gray-900">{hospital?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(record.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {record.diagnosis && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Diagnosis</p>
              <p className="mt-1 text-sm text-gray-700">{record.diagnosis}</p>
            </div>
          )}

          {record.symptoms && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Symptoms</p>
              <p className="mt-1 text-sm text-gray-700">{record.symptoms}</p>
            </div>
          )}

          {record.observations && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Observations</p>
              <p className="mt-1 text-sm text-gray-700">{record.observations}</p>
            </div>
          )}

          {record.treatment && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Treatment</p>
              <p className="mt-1 text-sm text-gray-700">{record.treatment}</p>
            </div>
          )}

          {record.prescription && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Prescription</p>
              <p className="mt-1 text-sm text-gray-700">{record.prescription}</p>
            </div>
          )}

          {record.doctorNotes && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Doctor's Notes</p>
              <p className="mt-1 text-sm text-gray-700">{record.doctorNotes}</p>
            </div>
          )}

          {record.recommendations && (
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Recommendations</p>
              <p className="mt-1 text-sm text-gray-700">{record.recommendations}</p>
            </div>
          )}

          <PrescriptionSummary
            prescription={record.structuredPrescription}
            onDownload={onPrescriptionDownload}
            downloading={prescriptionDownloading}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => onDownload(record)}
            disabled={downloading}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Download size={16} className="mr-1 inline" />
            {downloading ? "Preparing..." : "Download PDF"}
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatientMedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [prescriptionDownloadingId, setPrescriptionDownloadingId] = useState(null);
  const [healthProfile, setHealthProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadForm, setUploadForm] = useState({ title: "", description: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/medical-records/patient");
      setRecords(response.data?.records || []);
      setHealthProfile(response.data?.healthProfile || null);
    } catch (err) {
      console.error("Fetch medical records error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load your medical records."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const downloadRecord = async (record) => {
    try {
      setDownloadingId(record.id);
      setError("");
      const response = await api.get(`/medical-records/${record.id}/download`, {
        responseType: "blob",
      });
      const patientName = (record.patient?.name || "Patient")
        .replace(/[^a-z0-9]+/gi, "_")
        .replace(/^_|_$/g, "");
      const recordDate = new Date(record.createdAt).toISOString().slice(0, 10);
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Medical_Record_${patientName || "Patient"}_${recordDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to download this medical record. Please try again."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const downloadPrescription = async (prescription) => {
    try {
      setPrescriptionDownloadingId(prescription.id);
      setError("");
      const response = await api.get(`/prescriptions/${prescription.id}/download`, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Medical_Prescription_${prescription.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to download this prescription. Please try again.");
    } finally {
      setPrescriptionDownloadingId(null);
    }
  };

  const handleUploadDocument = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadError("Please select a medical document to upload.");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");
      setUploadSuccess("");

      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("title", uploadForm.title || selectedFile.name);
      formData.append("description", uploadForm.description || "Patient uploaded document");

      const response = await api.post("/medical-records/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSelectedFile(null);
      setUploadForm({ title: "", description: "" });
      setUploadSuccess(response.data?.message || "Medical document uploaded successfully.");
      fetchRecords();
    } catch (err) {
      setUploadError(err.response?.data?.message || "Unable to upload this document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-600">Medical Records</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">
          My Medical Records
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          View and download your medical records from consultations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary icon={FileText} label="Total Records" value={records.length} />
        <Summary icon={Stethoscope} label="Consultations" value={records.length} />
        <Summary icon={Calendar} label="Last Record" value={records.length > 0 ? new Date(records[0].createdAt).toLocaleDateString() : "—"} />
      </div>

      <HealthProfileSummary profile={healthProfile} />

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upload Medical Document</h2>
            <p className="mt-1 text-sm text-gray-500">Add a PDF or image document to your medical record collection.</p>
          </div>
        </div>

        <form onSubmit={handleUploadDocument} className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              Document title
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Lab report, prescription, scan, etc."
                className="mt-1 w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Document file
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="mt-1 block w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Notes
            <textarea
              value={uploadForm.description}
              onChange={(e) => setUploadForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Optional note or summary for this document"
              rows={3}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white"
            />
          </label>

          {uploadError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{uploadError}</div>
          )}

          {uploadSuccess && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{uploadSuccess}</div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <XCircle size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Medical History
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your complete medical record history from all consultations.
            </p>
          </div>

          <button
            onClick={fetchRecords}
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
          ) : records.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
              <FileText className="mx-auto text-gray-400" size={38} />
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                No Medical Records
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                You have no medical records yet. Records will appear here after your consultations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <MedicalRecordCard
                  key={record.id}
                  record={record}
                  onView={setSelectedRecord}
                  onDownload={downloadRecord}
                  downloading={downloadingId === record.id}
                  onPrescriptionDownload={downloadPrescription}
                  prescriptionDownloading={prescriptionDownloadingId === record.structuredPrescription?.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedRecord && (
        <RecordDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onDownload={downloadRecord}
          downloading={downloadingId === selectedRecord.id}
          onPrescriptionDownload={downloadPrescription}
          prescriptionDownloading={prescriptionDownloadingId === selectedRecord.structuredPrescription?.id}
        />
      )}
    </div>
  );
}

function HealthProfileSummary({ profile }) {
  const age = profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;
  return (
    <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><UserRound size={20} /></div><div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Patient-reported information</p><h2 className="text-xl font-bold text-[#152420]">Initial Health Information</h2></div></div>
      {!profile ? <p className="mt-4 text-sm text-[#6E7B76]">No health profile has been added yet. You can add it from Settings.</p> : <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><Info label="Date of Birth" value={profile.dateOfBirth} /><Info label="Age" value={age === null ? "Not provided" : `${age} years`} /><Info label="Sex" value={profile.sex?.replaceAll("_", " ") || "Not provided"} /><Info label="Blood Group" value={profile.bloodGroup || "Not provided"} /><Info label="Family Medical History" value={profile.familyMedicalHistory} /><Info label="Allergies" value={profile.allergies} /><Info label="Existing Conditions" value={profile.existingConditions} /><Info label="Current Medications" value={profile.currentMedications} /><Info label="Other Health Information" value={profile.otherHealthInformation} /></div>}
    </section>
  );
}

function Info({ label, value }) { return <div><p className="text-xs font-semibold uppercase text-[#98A29D]">{label}</p><p className="mt-1 whitespace-pre-wrap text-[#6E7B76]">{value || "Not provided"}</p></div>; }
function calculateAge(dateOfBirth) { const birth = new Date(`${dateOfBirth}T00:00:00`); const today = new Date(); let age = today.getFullYear() - birth.getFullYear(); const beforeBirthday = today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()); return beforeBirthday ? age - 1 : age; }

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
