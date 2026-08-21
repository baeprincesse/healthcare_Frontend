import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/logo.jpg";
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [show, setShow] = useState(false);

  const handle = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const submit = (event) => {
    event.preventDefault();

    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      confirm: form.confirm,
    });

    navigate("/dashboard");
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
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              Create account
            </button>

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