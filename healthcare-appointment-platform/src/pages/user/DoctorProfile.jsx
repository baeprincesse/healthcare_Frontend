import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Loader2, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api.js";

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/doctors/${doctorId}`)
      .then((response) => setDoctor(response.data?.data || null))
      .catch(() => setError("Unable to load this doctor's profile."))
      .finally(() => setLoading(false));
  }, [doctorId]);

  if (loading) return <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]"><Loader2 className="mx-auto animate-spin text-emerald-600" /></div>;
  if (error || !doctor) return <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600">{error || "Doctor not found."}</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6E7B76] hover:text-emerald-600"><ArrowLeft size={17} /> Back</button>
      <section className="rounded-2xl border border-[#E7ECE9] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">{(doctor.name || "Dr").replace("Dr. ", "").split(" ").map((part) => part[0]).join("")}</div>
          <div><p className="text-sm font-semibold text-emerald-600">Approved healthcare professional</p><h1 className="mt-1 text-2xl font-extrabold">{doctor.name}</h1><p className="mt-1 text-[#6E7B76]">{doctor.specialty || "General Medicine"}</p><p className="mt-2 text-sm text-[#6E7B76]"><MapPin size={14} className="mr-1 inline" />{doctor.hospital?.name || "Hospital"}{doctor.hospital?.city ? `, ${doctor.hospital.city}` : ""}</p></div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => navigate(`/appointments/book/${doctor.id}`)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"><CalendarDays size={17} /> Book Appointment</button></div>
      </section>
    </div>
  );
}
