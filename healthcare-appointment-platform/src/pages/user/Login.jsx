import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/logo.jpg";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [notice] = useState(location.state?.message || "");
  const [loading, setLoading] = useState(false);

  const handle = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(form);
      const role = data?.user?.role;

      console.log("LOGIN USER:", data.user);
      console.log("LOGIN ROLE:", role);

      if (role === "SUPER_ADMINISTRATOR") {
        navigate("/platform-admin/dashboard", { replace: true });
        return;
      }

      if (role === "HEAD_ADMINISTRATOR") {
        navigate("/hospital-admin/dashboard", { replace: true });
        return;
      }

      if (role === "DOCTOR") {
        navigate("/doctor/dashboard", { replace: true });
        return;
      }

      if (role === "PATIENT") {
        navigate("/dashboard", { replace: true });
        return;
      }

      setError(`Unknown user role: ${role || "missing role"}`);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-4 py-4">
      <div className="grid w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-emerald-700 to-emerald-500 p-6 text-white md:flex md:items-center md:justify-center">
          <div className="max-w-xs text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 p-3">
              <img src={logo} alt="MediCare" className="h-full w-full object-contain" />
            </div>
            <h2 className="text-xl font-bold">Welcome Back to MediCare</h2>
            <p className="mt-2 text-xs leading-5 text-emerald-50">
              Connect with hospitals, doctors, and healthcare services from one simple platform.
            </p>
            <div className="mt-5 flex justify-center gap-2 text-[11px] text-emerald-50">
              <span>Simple</span><span>•</span><span>Secure</span><span>•</span><span>Reliable</span>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2 md:hidden">
            <img src={logo} alt="MediCare" className="h-9 w-9 rounded-lg object-cover" />
            <span className="font-bold text-emerald-600">MediCare</span>
          </div>

          <h1 className="text-center text-xl font-bold text-slate-950">Welcome Back</h1>

          <form onSubmit={submit} className="mt-4 space-y-3">
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {error}
              </div>
            )}

            {notice && !error && (
              <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                {notice} Your account will be available after System Administrator approval.
              </div>
            )}

            <label className="block text-xs font-medium text-slate-700">
              Email address
              <input
                required
                type="email"
                value={form.email}
                onChange={handle("email")}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="relative block text-xs font-medium text-slate-700">
              Password
              <input
                required
                type={show ? "text" : "password"}
                value={form.password}
                onChange={handle("password")}
                placeholder="Enter your password"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-12 text-xs outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
              <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute right-3 top-[27px] text-[11px] font-medium text-emerald-600"
              >
                {/* {show ? "Hide" : "Show"} */}
              </button>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-500">
            Do not have an account?{" "}
            <Link to="/register" className="font-semibold text-emerald-600">
              Sign up
            </Link>
          </div>

          <div className="mt-3 text-center">
            <Link to="/forgot-password" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              Forgot Password?
            </Link>
          </div>

          <div className="mt-3 text-center">
            <Link to="/" className="text-[11px] text-slate-400 hover:text-emerald-600">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

