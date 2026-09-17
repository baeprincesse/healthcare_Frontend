import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    setMessage("");
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email: normalizedEmail });
      setMessage(response.data?.message || "If an account with this email exists, a password reset link has been sent.");
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-4 py-4 text-slate-900">
      <div className="mx-auto w-full max-w-md space-y-4">
        <header className="rounded-2xl bg-white p-6 shadow-xl">
          <p className="text-sm font-semibold text-emerald-600">MediCare</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Forgot password?</h1>
          <p className="mt-2 text-sm text-slate-600">Enter your email and we&apos;ll send a secure reset link.</p>
        </header>

        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <form onSubmit={submit} className="space-y-4">
            {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            {message && <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}
            <label className="block text-sm font-medium text-slate-700">
              Email address
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100" placeholder="you@example.com" required />
            </label>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-600">
            Remembered your password? <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
