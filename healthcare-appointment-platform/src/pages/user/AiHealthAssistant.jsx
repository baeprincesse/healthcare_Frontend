import { useState } from "react";
import { AlertTriangle, Brain, CalendarDays, ImagePlus, Loader2, RotateCcw, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { chatWithPatient } from "../../services/aiService.js";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hello! I am your AI Health Assistant. Tell me what symptoms you are experiencing. I can provide general health information, but I am not a doctor and cannot provide a definitive diagnosis.",
};

export default function AiHealthAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assessment, setAssessment] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [recommendationMessage, setRecommendationMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((current) => [...current, { role: "user", content: message }]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const result = await chatWithPatient(message, history, image);
      const assistantResponse = result.response;
      setMessages((current) => [
        ...current,
        { role: "assistant", content: assistantResponse.message },
      ]);
      if (assistantResponse.assessmentComplete) {
        setAssessment(assistantResponse);
        setDoctors(result.recommendedDoctors || []);
        setRecommendationMessage(result.recommendationMessage || "");
      }
      setImage(null);
      setImagePreview("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to reach the AI assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
    setError("");
    setAssessment(null);
    setDoctors([]);
    setRecommendationMessage("");
    setImage(null);
    setImagePreview("");
  };

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Images must be smaller than 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setImage({ mimeType: file.type, data: result.split(",")[1] || "" });
      setImagePreview(result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-emerald-600">Patient Support</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-[28px]">AI Health Assistant</h1>
          <p className="mt-1 text-sm text-[#6E7B76]">Describe your symptoms and receive general health guidance.</p>
        </div>
        <button onClick={resetConversation} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E7ECE9] bg-white px-4 py-2.5 text-sm font-semibold text-[#6E7B76] hover:bg-[#F5F7F6]">
          <RotateCcw size={16} /> New conversation
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="flex min-h-[620px] flex-col rounded-2xl border border-[#E7ECE9] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E7ECE9] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Brain size={22} /></div>
            <div>
              <h2 className="font-bold">Health conversation</h2>
              <p className="text-xs text-[#6E7B76]">AI-assisted information, not a diagnosis</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${item.role === "user" ? "rounded-br-md bg-emerald-600 text-white" : "rounded-bl-md bg-[#F5F7F6] text-[#152420]"}`}>
                  {item.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-[#6E7B76]"><Loader2 size={16} className="animate-spin text-emerald-600" /> AI is analyzing...</div>
            )}
            {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          </div>

          <form onSubmit={sendMessage} className="border-t border-[#E7ECE9] p-4">
            {imagePreview && <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#F5F7F6] p-2"><img src={imagePreview} alt="Selected skin image" className="h-16 w-16 rounded-lg object-cover" /><span className="flex-1 text-xs text-[#6E7B76]">Image attached for this message</span><button type="button" onClick={() => { setImage(null); setImagePreview(""); }} aria-label="Remove image" className="rounded-lg p-1 text-[#6E7B76] hover:bg-white"><X size={16} /></button></div>}
            <div className="flex items-end gap-2 rounded-xl border border-[#D7E2DD] bg-white p-2 focus-within:border-emerald-500">
              <textarea value={input} onChange={(event) => setInput(event.target.value)} disabled={loading} maxLength={2000} rows={2} placeholder="Describe what you are experiencing..." className="min-h-[48px] flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none" />
              <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E7ECE9] text-emerald-700 hover:bg-emerald-50" aria-label="Attach image"><ImagePlus size={17} /><input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectImage} disabled={loading} className="hidden" /></label>
              <button type="submit" disabled={loading || !input.trim()} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"><Send size={17} /></button>
            </div>
            <p className="mt-2 text-[11px] text-[#98A29D]">Do not share passwords, payment details, or other private information.</p>
          </form>
        </section>

        {assessment ? <AssessmentPanel assessment={assessment} doctors={doctors} recommendationMessage={recommendationMessage} navigate={navigate} /> : (
          <aside className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
            <h2 className="font-bold">Before you begin</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#6E7B76]">
              <li>Share symptoms, duration, severity, and anything that makes them better or worse.</li>
              <li>The assistant may ask follow-up questions before offering general guidance.</li>
              <li>For severe or life-threatening symptoms, seek emergency care immediately.</li>
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}

function AssessmentPanel({ assessment, doctors, recommendationMessage, navigate }) {
  const isEmergency = assessment.urgency === "emergency";
  return (
    <aside className="space-y-5">
      {isEmergency && (
        <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 text-red-900 shadow-sm">
          <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-red-600" size={22} /><div><h2 className="font-extrabold">Seek emergency medical care</h2><p className="mt-2 text-sm leading-6">Your symptoms may require urgent attention. Contact your local emergency service or go to the nearest emergency department now. Do not wait for a routine appointment.</p></div></div>
        </div>
      )}
      <section className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
        <h2 className="font-bold">AI Assessment</h2>
        <div className="mt-4 space-y-4 text-sm">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-[#98A29D]">Summary</p><p className="mt-1 text-[#6E7B76]">{assessment.summary}</p></div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-[#98A29D]">Possible conditions to consider</p>{assessment.possibleConditions.length ? <ul className="mt-1 list-disc space-y-1 pl-5 text-[#6E7B76]">{assessment.possibleConditions.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-1 text-[#6E7B76]">Insufficient information</p>}</div>
          <div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#F5F7F6] p-3"><p className="text-xs text-[#98A29D]">Specialty</p><p className="mt-1 font-bold">{assessment.specialty || "Not determined"}</p></div><div className="rounded-xl bg-[#F5F7F6] p-3"><p className="text-xs text-[#98A29D]">Urgency</p><p className="mt-1 font-bold capitalize">{assessment.urgency}</p></div></div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-[#98A29D]">Recommendation</p><p className="mt-1 text-[#6E7B76]">{assessment.recommendation}</p></div>
          <p className="border-t border-[#E7ECE9] pt-4 text-xs font-semibold text-[#6E7B76]">AI-assisted information does not constitute a definitive diagnosis or treatment plan. Consult a qualified healthcare professional.</p>
        </div>
      </section>
      {!isEmergency && assessment.specialty && <section className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm"><h2 className="font-bold">Recommended Doctors</h2>{recommendationMessage && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{recommendationMessage}</p>}{doctors.length > 0 && <div className="mt-4 space-y-3">{doctors.map((doctor) => <div key={`${doctor.id}-${doctor.hospital?.id || "hospital"}`} className="rounded-xl border border-[#E7ECE9] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{doctor.name}</p><p className="text-sm text-[#6E7B76]">{doctor.specialty}</p><p className="mt-1 text-xs text-[#6E7B76]">Hospital: {doctor.hospital?.name || "Hospital"}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${doctor.available ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{doctor.available ? "Availability found" : "Check availability"}</span></div><div className="mt-3 flex gap-2"><button onClick={() => navigate(`/doctors/${doctor.id}`)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"><CalendarDays size={14} /> View Doctor</button><button onClick={() => navigate(`/appointments/book/${doctor.id}`)} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">Book Appointment</button></div></div>)}</div>}</section>}
    </aside>
  );
}
