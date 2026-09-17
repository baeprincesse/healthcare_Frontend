import { useCallback, useEffect, useState } from "react";
import { Brain, Eye, FileText, Loader2, Users, XCircle, ShieldCheck, ShieldOff, Send, CheckCircle2 } from "lucide-react";
import api from "../services/api.js";
import { analyzePatient } from "../services/aiService.js";

function MedicalRecordCard({ record, onView, onAnalyze, analyzing }) {
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
              {record.patient?.name || "Unknown Patient"}
            </h3>
            <p className="text-sm text-gray-500">
              {record.appointment?.appointmentDate} at {record.appointment?.appointmentTime}
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
            onClick={() => onAnalyze(record.patientId)}
            disabled={analyzing}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {analyzing ? <Loader2 size={16} className="mr-1 inline animate-spin" /> : <Brain size={16} className="mr-1 inline" />}
            {analyzing ? "Analyzing..." : "Analyze with AI"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecordDetailModal({ record, onClose }) {
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
              <p className="font-semibold text-gray-900">{record.patient?.name || "Unknown"}</p>
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
            <div>
              <p className="text-xs text-gray-400">Appointment</p>
              <p className="font-semibold text-gray-900">
                {record.appointment?.appointmentDate} at {record.appointment?.appointmentTime}
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
        </div>

        <div className="mt-6 flex justify-end">
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

export default function DoctorMedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analysisPatientId, setAnalysisPatientId] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [requestingPatientId, setRequestingPatientId] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [recordsRes, patientsRes, requestsRes] = await Promise.all([
        api.get("/medical-records/doctor"),
        api.get("/medical-record-access/my-patients"),
        api.get("/medical-record-access/my-requests"),
      ]);

      setRecords(recordsRes.data?.records || []);
      setPatients(patientsRes.data?.patients || []);
      setAccessRequests(requestsRes.data?.accesses || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load medical records."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRequestAccess = async (patientId, appointmentId) => {
    setRequestingPatientId(patientId);
    setRequestMessage("");
    try {
      await api.post("/medical-record-access/request", { patientId, appointmentId });
      setRequestMessage("Access request sent. The patient will be notified and must approve it before you can open their records.");
      const requestsRes = await api.get("/medical-record-access/my-requests");
      setAccessRequests(requestsRes.data?.accesses || []);
    } catch (err) {
      setRequestMessage(err.response?.data?.message || "Unable to send access request.");
    } finally {
      setRequestingPatientId(null);
    }
  };

  const handleAnalyze = async (patientId) => {
    try {
      setAnalysisLoading(true);
      setAnalysisPatientId(patientId);
      setAnalysisError("");
      setAnalysis(await analyzePatient(patientId));
    } catch (err) {
      setAnalysis(null);
      setAnalysisError(err.response?.data?.message || "Unable to analyze this patient's records.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const uniquePatients = [...new Set(records.map((r) => r.patientId))].length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-600">Medical Records</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#152420]">
          Patient Medical Records
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          View medical records you have created for your patients.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary icon={FileText} label="Total Records" value={records.length} />
        <Summary icon={Users} label="Patients" value={uniquePatients} />
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

      {requestMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Request Sent</p>
            <p className="mt-1">{requestMessage}</p>
          </div>
        </div>
      )}

      {/* Access Requests Status */}
      {accessRequests.length > 0 && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-gray-900">
            <ShieldCheck size={20} className="text-emerald-600" />
            My Access Requests
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Requests you have sent to patients for medical record access.
          </p>
          <div className="mt-4 space-y-3">
            {accessRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between gap-4 rounded-xl border border-[#E7ECE9] bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {(req.patient?.name || 'P').split(' ').map((x) => x[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{req.patient?.name || 'Patient'}</p>
                    <p className="text-xs text-[#98A29D]">
                      Requested {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  req.status === 'ACCEPTED'
                    ? 'bg-emerald-50 text-emerald-700'
                    : req.status === 'REJECTED'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {req.status === 'ACCEPTED'
                    ? 'Authorized'
                    : req.status === 'REJECTED'
                    ? 'Rejected by patient'
                    : 'Pending patient approval'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Patients I can request access from */}
      {patients.length > 0 && (
        <section className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-gray-900">
            <Send size={20} className="text-emerald-600" />
            My Patients — Request Access
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Send an access request to patients you have consulted with.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {patients.map((p) => {
              const alreadyRequested = accessRequests.some(
                (r) => r.patientId === p.id && r.status !== "REJECTED"
              );
              return (
                <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#E7ECE9] bg-[#F5F7F6] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {(p.name || 'P').split(' ').map((x) => x[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-xs text-[#98A29D]">Last visit: {p.lastAppointment || 'N/A'}</p>
                    </div>
                  </div>
                  {alreadyRequested ? (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Requested
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRequestAccess(p.id, p.appointmentId)}
                      disabled={requestingPatientId === p.id}
                      className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {requestingPatientId === p.id ? 'Sending...' : 'Request Access'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {analysisError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <XCircle size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">AI analysis unavailable</p>
            <p className="mt-1">{analysisError}</p>
          </div>
        </div>
      )}

      {analysis && (
        <AiAnalysisSection analysis={analysis} />
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Medical Records Created
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Records you have created during consultations.
            </p>
          </div>

          <button
            onClick={fetchAll}
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
                You have not created any medical records yet. Records will appear here after your consultations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <MedicalRecordCard
                  key={record.id}
                  record={record}
                  onView={setSelectedRecord}
                  onAnalyze={handleAnalyze}
                  analyzing={analysisLoading && analysisPatientId === record.patientId}
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
        />
      )}
    </div>
  );
}

function AiAnalysisSection({ analysis }) {
  const sections = [
    ["Key Findings", analysis.keyFindings],
    ["Possible conditions to consider", analysis.possibleConditions],
    ["Risk Factors", analysis.riskFactors],
    ["Recommended Questions", analysis.recommendedQuestions],
    ["Warning Signs", analysis.warningSigns],
    ["Clinical Considerations", analysis.clinicalConsiderations],
  ];

  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <Brain size={21} />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-700">AI-assisted clinical decision support</p>
          <h2 className="text-xl font-bold text-gray-900">AI Analysis</h2>
        </div>
      </div>
      <div className="mt-5 space-y-5 text-sm text-gray-700">
        <div>
          <h3 className="font-bold text-gray-900">Patient Summary</h3>
          <p className="mt-1">{analysis.patientSummary}</p>
        </div>
        {sections.map(([title, items]) => (
          <div key={title}>
            <h3 className="font-bold text-gray-900">{title}</h3>
            {items.length > 0 ? (
              <ul className="mt-1 list-disc space-y-1 pl-5">{items.map((item) => <li key={item}>{item}</li>)}</ul>
            ) : <p className="mt-1 text-gray-500">Insufficient information</p>}
          </div>
        ))}
        <p className="border-t border-emerald-200 pt-4 text-xs font-semibold text-gray-600">{analysis.disclaimer}</p>
      </div>
    </section>
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
