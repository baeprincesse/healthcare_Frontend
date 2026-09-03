import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/logo.jpg";
import api from "../../services/api.js";

const ROLES = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
  { value: "hospital_admin", label: "Hospital Administrator" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    role: "",
    specialty: "",
    professionalRegistrationNumber: "",
    hospitalId: "",
    hospitalName: "",
    address: "",
    city: "",
    hospitalPhone: "",
    hospitalEmail: "",
    description: "",
    officialRegistrationNumber: "",
  });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [hospitalQuery, setHospitalQuery] = useState("");
  const [hospitalResults, setHospitalResults] = useState([]);
  const [hospitalSearching, setHospitalSearching] = useState(false);
  const [showHospitalResults, setShowHospitalResults] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const searchTimeout = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowHospitalResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handle = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleRoleChange = (value) => {
    setForm((prev) => ({
      ...prev,
      role: value,
      specialty: "",
      professionalRegistrationNumber: "",
      hospitalId: "",
      hospitalName: "",
      address: "",
      city: "",
      hospitalPhone: "",
      hospitalEmail: "",
      description: "",
      officialRegistrationNumber: "",
    }));
    setSelectedHospital(null);
    setHospitalQuery("");
    setHospitalResults([]);
  };

  const searchHospitals = async (query) => {
    if (!query || query.trim().length < 2) {
      setHospitalResults([]);
      setHospitalSearching(false);
      return;
    }
    setHospitalSearching(true);
    try {
      const response = await api.get("/hospitals/search", {
        params: { q: query.trim() },
      });
      setHospitalResults(response.data?.data || []);
      setShowHospitalResults(true);
    } catch {
      setHospitalResults([]);
    } finally {
      setHospitalSearching(false);
    }
  };

  const handleHospitalQueryChange = (value) => {
    setHospitalQuery(value);
    setSelectedHospital(null);
    setForm((prev) => ({ ...prev, hospitalId: "" }));

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      searchHospitals(value);
    }, 400);
  };

  const selectHospital = (hospital) => {
    setSelectedHospital(hospital);
    setHospitalQuery(hospital.name);
    setForm((prev) => ({ ...prev, hospitalId: hospital.id }));
    setShowHospitalResults(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!form.role) {
      setError("Please select a role.");
      return;
    }

    if (!form.password) {
      setError("Please enter a password.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!form.confirm) {
      setError("Please confirm your password.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (form.role === "doctor") {
      if (!form.specialty.trim()) {
        setError("Please enter your specialty.");
        return;
      }
      if (!form.professionalRegistrationNumber.trim()) {
        setError("Professional registration number is required.");
        return;
      }
      if (form.professionalRegistrationNumber.trim().length < 3) {
        setError("Professional registration number must be at least 3 characters.");
        return;
      }
      if (!form.hospitalId) {
        setError("Please select your hospital.");
        return;
      }
    }

    if (form.role === "hospital_admin") {
      if (!form.hospitalName.trim()) {
        setError("Please enter the hospital name.");
        return;
      }
      if (!form.address.trim()) {
        setError("Please enter the hospital address.");
        return;
      }
      if (!form.officialRegistrationNumber.trim()) {
        setError("Official hospital registration number is required.");
        return;
      }
      if (form.officialRegistrationNumber.trim().length < 3) {
        setError("Official hospital registration number must be at least 3 characters.");
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        confirm: form.confirm,
        role: form.role,
      };

      if (form.role === "doctor") {
        payload.specialty = form.specialty.trim();
        payload.professionalRegistrationNumber = form.professionalRegistrationNumber.trim();
        payload.hospitalId = Number(form.hospitalId);
      }

      if (form.role === "hospital_admin") {
        payload.hospitalName = form.hospitalName.trim();
        payload.address = form.address.trim();
        payload.city = form.city.trim();
        payload.hospitalPhone = form.hospitalPhone.trim();
        payload.hospitalEmail = form.hospitalEmail.trim();
        payload.description = form.description.trim();
        payload.officialRegistrationNumber = form.officialRegistrationNumber.trim();
      }

      console.log("REGISTERING USER:", {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
      });

      const data = await register(payload);

      console.log("REGISTER SUCCESS:", data);

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("REGISTRATION FAILED:", error);
      setError(
        error.message || "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-4 py-4">

      <div className="grid w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">

        {/* Left */}
        <div className="hidden bg-gradient-to-br from-emerald-700 to-emerald-500 p-6 text-white md:flex md:items-center md:justify-center">

          <div className="max-w-xs text-center">

            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 p-3">
              <img
                src={logo}
                alt="MediCare"
                className="h-full w-full object-contain"
              />
            </div>

            <h2 className="text-xl font-bold text-center">
              Join MediCare
            </h2>

            <p className="mt-2 text-xs leading-5 text-emerald-50">
              Connect with hospitals, doctors, and healthcare services
              from one simple platform.
            </p>

            <div className="mt-5 flex justify-center gap-2 text-[11px] text-emerald-50">
              <span>Simple</span>
              <span>•</span>
              <span>Secure</span>
              <span>•</span>
              <span>Reliable</span>
            </div>

          </div>
        </div>

        {/* Form */}
        <div className="p-5 sm:p-6">

          {/* Mobile logo */}
          <div className="mb-3 flex items-center gap-2 md:hidden">
            <img
              src={logo}
              alt="MediCare"
              className="h-9 w-9 rounded-lg object-cover"
            />

            <span className="font-bold text-emerald-600">
              MediCare
            </span>
          </div>

          <h1 className="text-xl font-bold text-slate-950 text-center">
            Create your account
          </h1>

          <p className="mt-1 text-xs text-slate-500 text-center">
            Join MediCare today.
          </p>

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-4 space-y-3">

            {/* Name */}
            <label className="block text-xs font-medium text-slate-700">
              Full name

              <input
                required
                type="text"
                value={form.name}
                onChange={handle("name")}
                placeholder="Your full name"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            {/* Email */}
            <label className="block text-xs font-medium text-slate-700">
              Email address

              <input
                required
                type="email"
                value={form.email}
                onChange={handle("email")}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            {/* Phone */}
            <label className="block text-xs font-medium text-slate-700">
              Phone number

              <input
                type="tel"
                value={form.phone}
                onChange={handle("phone")}
                placeholder="+237 6XX XXX XXX"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            {/* Role selector */}
            <div>
              <p className="text-xs font-medium text-slate-700 mb-1.5">
                Choose your role
              </p>
              <div className="space-y-1.5">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs cursor-pointer transition ${
                      form.role === r.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={form.role === r.value}
                      onChange={() => handleRoleChange(r.value)}
                      className="h-3.5 w-3.5 accent-emerald-600"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Doctor: specialty + professional registration number */}
            {form.role === "doctor" && (
              <>
                <label className="block text-xs font-medium text-slate-700">
                  Specialty

                  <input
                    type="text"
                    value={form.specialty}
                    onChange={handle("specialty")}
                    placeholder="e.g. Cardiology"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-700">
                  Professional Registration Number

                  <input
                    type="text"
                    value={form.professionalRegistrationNumber}
                    onChange={handle("professionalRegistrationNumber")}
                    placeholder="e.g. MED-12345"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </>
            )}

            {/* Doctor: hospital search */}
            {form.role === "doctor" && (
              <div className="relative" ref={resultsRef}>
                <label className="block text-xs font-medium text-slate-700">
                  Hospital where you work

                  <input
                    type="text"
                    value={hospitalQuery}
                    onChange={(e) => handleHospitalQueryChange(e.target.value)}
                    onFocus={() => {
                      if (hospitalResults.length > 0) setShowHospitalResults(true);
                    }}
                    placeholder="Search hospital..."
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                {selectedHospital && form.hospitalId && (
                  <div className="mt-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                    Selected: <span className="font-semibold">{selectedHospital.name}</span>
                    {selectedHospital.city ? ` — ${selectedHospital.city}` : ""}
                  </div>
                )}

                {showHospitalResults && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                    {hospitalSearching && (
                      <div className="px-3 py-2 text-xs text-slate-500">Searching...</div>
                    )}
                    {!hospitalSearching && hospitalResults.length === 0 && (
                      <div className="px-3 py-2 text-xs text-slate-500">
                        No hospitals found.{" "}
                        <span className="text-slate-400">
                          Ask your hospital administrator to register it first.
                        </span>
                      </div>
                    )}
                    {!hospitalSearching &&
                      hospitalResults.map((h) => (
                        <button
                          type="button"
                          key={h.id}
                          onClick={() => selectHospital(h)}
                          className="flex w-full items-start gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50"
                        >
                          <span className="font-medium">{h.name}</span>
                          {h.city && (
                            <span className="text-slate-400">— {h.city}</span>
                          )}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Hospital admin: hospital fields */}
            {form.role === "hospital_admin" && (
              <>
                <label className="block text-xs font-medium text-slate-700">
                  Hospital Name

                  <input
                    type="text"
                    value={form.hospitalName}
                    onChange={handle("hospitalName")}
                    placeholder="Hospital name"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-700">
                  Address

                  <input
                    type="text"
                    value={form.address}
                    onChange={handle("address")}
                    placeholder="Hospital address"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-700">
                  City

                  <input
                    type="text"
                    value={form.city}
                    onChange={handle("city")}
                    placeholder="City"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-700">
                  Phone

                  <input
                    type="tel"
                    value={form.hospitalPhone}
                    onChange={handle("hospitalPhone")}
                    placeholder="+237 6XX XXX XXX"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-700">
                  Email

                  <input
                    type="email"
                    value={form.hospitalEmail}
                    onChange={handle("hospitalEmail")}
                    placeholder="hospital@example.com"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-700">
                  Official Hospital Registration Number

                  <input
                    type="text"
                    value={form.officialRegistrationNumber}
                    onChange={handle("officialRegistrationNumber")}
                    placeholder="e.g. HOSP-001"
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-700">
                  Description

                  <textarea
                    value={form.description}
                    onChange={handle("description")}
                    placeholder="Brief description of the hospital"
                    rows={2}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </>
            )}

            {/* Password */}
            <label className="relative block text-xs font-medium text-slate-700">
              Password

              <input
                required
                type={show ? "text" : "password"}
                value={form.password}
                onChange={handle("password")}
                placeholder="Create a password"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-12 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

              <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute right-3 top-[27px] text-[11px] font-medium text-emerald-600 hover:text-emerald-700"
              >
                {show ? "Hide" : "Show"}
              </button>
            </label>

            {/* Confirm */}
            <label className="block text-xs font-medium text-slate-700">
              Confirm password

              <input
                required
                type={show ? "text" : "password"}
                value={form.confirm}
                onChange={handle("confirm")}
                placeholder="Confirm password"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            {/* Terms */}
            <label className="flex items-start gap-2 text-[11px] leading-4 text-slate-500">
              <input
                required
                type="checkbox"
                className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />

              <span>
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="font-medium text-emerald-600"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-emerald-600"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Button */}
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60" > {loading ? "Creating account..." : "Create account"} </button>

          </form>

          <div className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
             login
            </Link>
          </div>

          <div className="mt-3 text-center">
            <Link
              to="/"
              className="text-[11px] text-slate-400 hover:text-emerald-600"
            >
              ← Back to home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
