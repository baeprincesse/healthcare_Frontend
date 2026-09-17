
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Video, FileText, Save, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import api from "../../services/api.js";
import PrescriptionEditor from "../../components/PrescriptionEditor.jsx";

export default function VideoConsultation() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [healthProfile, setHealthProfile] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);
  const [recordSuccess, setRecordSuccess] = useState("");
  const [recordError, setRecordError] = useState("");
  const [prescriptionItems, setPrescriptionItems] = useState([]);

  const [medicalForm, setMedicalForm] = useState({
    diagnosis: "",
    symptoms: "",
    observations: "",
    treatment: "",
    prescription: "",
    doctorNotes: "",
    recommendations: "",
  });

  useEffect(() => {
    let cancelled = false;

    const loadAppointment = async () => {
      try {
        const response = await api.get(`/appointments/${appointmentId}`);
        const data = response.data?.data;

        if (!data) {
          setError("Appointment not found.");
          setLoading(false);
          return;
        }

        if (
          data.consultationType !== "ONLINE" ||
          !data.jitsiRoomName
        ) {
          setError(
            "This appointment does not have an online consultation."
          );
          setLoading(false);
          return;
        }

        try {
          await api.get(`/appointments/${appointmentId}/join`);
        } catch (joinErr) {
          setError(
            joinErr.response?.data?.message ||
              "You cannot join this consultation yet."
          );
          setLoading(false);
          return;
        }

        if (cancelled) return;

        setAppointment(data);
        setLoading(false);

        const token = localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserRole(payload.role);
        }

        if (data.status === "IN_PROCESS") {
          try {
            const accessRes = await api.get(`/medical-records/consultation/${appointmentId}`);
            if (!cancelled) {
              setMedicalRecords(accessRes.data?.records || []);
              setHasAccess(accessRes.data?.authorized || false);
              setHealthProfile(accessRes.data?.healthProfile || null);
            }
          } catch (err) {
            if (!cancelled) {
              setHasAccess(false);
            }
          }
        }

        loadJitsiScript(
          data.jitsiRoomName,
          data.doctor?.name || data.patient?.name || "Participant"
        );
      } catch (err) {
        if (cancelled) return;

        setError(
          err.response?.data?.message ||
            "Unable to load the consultation."
        );

        setLoading(false);
      }
    };

    const loadJitsiScript = (roomName, displayName) => {
      if (window.JitsiMeetExternalAPI) {
        initJitsi(roomName, displayName);
        return;
      }

      const existingScript = document.querySelector(
        'script[data-jitsi-api="true"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => {
          if (!cancelled) {
            initJitsi(roomName, displayName);
          }
        });

        return;
      }

      const script = document.createElement("script");

      script.src = "https://meet.jit.si/external_api.js";

      script.async = true;
      script.dataset.jitsiApi = "true";

      script.onload = () => {
        if (!cancelled) {
          initJitsi(roomName, displayName);
        }
      };

      script.onerror = () => {
        if (!cancelled) {
          setError(
            "Failed to load the Jitsi video consultation."
          );
        }
      };

      document.body.appendChild(script);
    };

    const initJitsi = (roomName, displayName) => {
      if (
        cancelled ||
        !jitsiContainerRef.current ||
        !window.JitsiMeetExternalAPI
      ) {
        return;
      }

      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch {
        }

        jitsiApiRef.current = null;
      }

      const domain = "meet.jit.si";

      jitsiApiRef.current =
        new window.JitsiMeetExternalAPI(domain, {
          roomName: roomName,
          parentNode: jitsiContainerRef.current,
          width: "100%",
          height: "100%",

          userInfo: {
            displayName: displayName,
          },

          configOverwrite: {
            prejoinPageEnabled: true,
          },

          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              "microphone",
              "camera",
              "closedcaptions",
              "desktop",
              "fullscreen",
              "fodeviceselection",
              "hangup",
              "chat",
              "settings",
              "raisehand",
            ],
          },
        });
    };

    loadAppointment();

    return () => {
      cancelled = true;

      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch {
        }

        jitsiApiRef.current = null;
      }
    };
  }, [appointmentId]);

  const handleSaveMedicalRecord = async (e) => {
    e.preventDefault();
    setSavingRecord(true);
    setRecordSuccess("");
    setRecordError("");

    if (prescriptionItems.some(
      (item) => !item.medicationName.trim() || !item.dosage.trim() || !item.frequency.trim() || !item.duration.trim()
    )) {
      setRecordError("Complete the medication name, dosage, frequency and duration for every medication.");
      setSavingRecord(false);
      return;
    }

    try {
      const response = await api.post("/medical-records", {
        appointmentId: parseInt(appointmentId),
        patientId: appointment.patientId,
        ...medicalForm,
      });

      if (prescriptionItems.length > 0) {
        await api.post("/prescriptions", {
          appointmentId: parseInt(appointmentId),
          medicalRecordId: response.data?.record?.id,
          items: prescriptionItems,
        });
      }

      setRecordSuccess("Medical record saved successfully.");
      setShowMedicalForm(false);
      setMedicalForm({
        diagnosis: "",
        symptoms: "",
        observations: "",
        treatment: "",
        prescription: "",
        doctorNotes: "",
        recommendations: "",
      });
      setPrescriptionItems([]);

      try {
        const accessRes = await api.get(`/medical-records/consultation/${appointmentId}`);
        setMedicalRecords(accessRes.data?.records || []);
      } catch (err) {
      }
    } catch (err) {
      setRecordError(
        err.response?.data?.message || "Unable to save medical record."
      );
    } finally {
      setSavingRecord(false);
    }
  };

  const handleEndConsultation = async () => {
    if (!window.confirm("Are you sure you want to end this consultation?")) {
      return;
    }

    try {
      await api.post(`/appointments/${appointmentId}/end`);
      navigate("/doctor/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to end consultation.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">
          Loading video consultation...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6E7B76] hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6E7B76] hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="flex items-center gap-4">
          {userRole === "DOCTOR" && appointment?.status === "IN_PROCESS" && (
            <button
              onClick={handleEndConsultation}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              End Consultation
            </button>
          )}
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <Video size={16} />

            <span className="font-semibold">
              {appointment?.consultationType === "ONLINE"
                ? "Online Consultation"
                : "Consultation"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-[#E7ECE9] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div>
            <span className="text-[#6E7B76]">Doctor:</span>{" "}
            <span className="font-semibold">
              {appointment?.doctor?.name || "Doctor"}
            </span>
          </div>

          <div>
            <span className="text-[#6E7B76]">Patient:</span>{" "}
            <span className="font-semibold">
              {appointment?.patient?.name || "Patient"}
            </span>
          </div>

          <div>
            <span className="text-[#6E7B76]">Date:</span>{" "}
            <span className="font-semibold">
              {appointment?.appointmentDate}
            </span>
          </div>

          <div>
            <span className="text-[#6E7B76]">Time:</span>{" "}
            <span className="font-semibold">
              {appointment?.appointmentTime}
            </span>
          </div>

          <div>
            <span className="text-[#6E7B76]">Status:</span>{" "}
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {appointment?.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div
            ref={jitsiContainerRef}
            className="overflow-hidden rounded-2xl border border-[#E7ECE9] bg-[#152420]"
            style={{
              height: "60vh",
              minHeight: "400px",
            }}
          />
        </div>

        <div className="space-y-4">
          {userRole === "DOCTOR" && appointment?.status === "IN_PROCESS" && (
            <div className="rounded-2xl border border-[#E7ECE9] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Medical Records</h3>
                {hasAccess ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    Authorized
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                    Not Authorized
                  </span>
                )}
              </div>

              {hasAccess ? (
                <>
                  {healthProfile && <PatientHealthProfile profile={healthProfile} />}
                  <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
                    {medicalRecords.length === 0 ? (
                      <p className="text-xs text-gray-500">No previous records found.</p>
                    ) : (
                      medicalRecords.slice(0, 5).map((record) => (
                        <div key={record.id} className="rounded-lg border border-gray-200 p-2 text-xs">
                          <p className="font-semibold text-gray-700">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500 truncate">
                            {record.diagnosis || "No diagnosis"}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => setShowMedicalForm(!showMedicalForm)}
                    className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    <FileText size={14} className="mr-1 inline" />
                    {showMedicalForm ? "Cancel" : "Add Medical Record"}
                  </button>
                </>
              ) : (
                <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                  <AlertCircle size={14} className="mr-1 inline" />
                  The patient has not authorized access to their medical records for this consultation.
                </div>
              )}
            </div>
          )}

          {userRole === "PATIENT" && (
            <div className="rounded-2xl border border-[#E7ECE9] bg-white p-4 shadow-sm">
              <h3 className="font-bold text-gray-900">Consultation</h3>
              <p className="mt-2 text-xs text-gray-500">
                You are in a video consultation with Dr. {appointment?.doctor?.name}. To let your doctor view your history and
                add records, accept their access request.
              </p>
            </div>
          )}
        </div>
      </div>

      {showMedicalForm && hasAccess && (
        <div className="mt-4 rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">Add Medical Record</h3>

          {recordSuccess && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <CheckCircle2 size={16} />
              {recordSuccess}
            </div>
          )}

          {recordError && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              <XCircle size={16} />
              {recordError}
            </div>
          )}

          <form onSubmit={handleSaveMedicalRecord} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-medium text-slate-700">
                Diagnosis
                <textarea
                  value={medicalForm.diagnosis}
                  onChange={(e) => setMedicalForm({ ...medicalForm, diagnosis: e.target.value })}
                  rows={2}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="block text-xs font-medium text-slate-700">
                Symptoms
                <textarea
                  value={medicalForm.symptoms}
                  onChange={(e) => setMedicalForm({ ...medicalForm, symptoms: e.target.value })}
                  rows={2}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="block text-xs font-medium text-slate-700">
                Observations
                <textarea
                  value={medicalForm.observations}
                  onChange={(e) => setMedicalForm({ ...medicalForm, observations: e.target.value })}
                  rows={2}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="block text-xs font-medium text-slate-700">
                Treatment
                <textarea
                  value={medicalForm.treatment}
                  onChange={(e) => setMedicalForm({ ...medicalForm, treatment: e.target.value })}
                  rows={2}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <PrescriptionEditor items={prescriptionItems} setItems={setPrescriptionItems} disabled={savingRecord} />

              <label className="block text-xs font-medium text-slate-700">
                Doctor's Notes
                <textarea
                  value={medicalForm.doctorNotes}
                  onChange={(e) => setMedicalForm({ ...medicalForm, doctorNotes: e.target.value })}
                  rows={2}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            </div>

            <label className="block text-xs font-medium text-slate-700">
              Recommendations
              <textarea
                value={medicalForm.recommendations}
                onChange={(e) => setMedicalForm({ ...medicalForm, recommendations: e.target.value })}
                rows={2}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <button
              type="submit"
              disabled={savingRecord}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              <Save size={14} />
              {savingRecord ? "Saving..." : "Save Medical Record"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function PatientHealthProfile({ profile }) {
  return (
    <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-xs">
      <p className="font-bold text-emerald-800">Patient-reported health information</p>
      <p className="mt-2 text-gray-600">Blood group: {profile.bloodGroup || "Not provided"} · Sex: {profile.sex?.replaceAll("_", " ") || "Not provided"}</p>
      <p className="mt-2 text-gray-600">Allergies: {profile.allergies || "Not provided"}</p>
      <p className="mt-1 text-gray-600">Existing conditions: {profile.existingConditions || "Not provided"}</p>
      <p className="mt-1 text-gray-600">Current medications: {profile.currentMedications || "Not provided"}</p>
    </div>
  );
}