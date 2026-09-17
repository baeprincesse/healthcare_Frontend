import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api.js";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/auth/reset-password/${encodeURIComponent(token || "")}`, { password });
      setSuccess(response.data?.message || "Your password has been reset successfully.");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (requestError) {
      const backendMessage = requestError.response?.data?.message || "Something went wrong. Please try again later.";
      if (backendMessage.includes("expired")) {
        setError("This password reset link has expired. Please request a new one.");
      } else if (backendMessage.includes("invalid")) {
        setError("This password reset link is invalid.");
      } else {
        setError(backendMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-4 py-4 text-slate-900">
      <div className="mx-auto w-full max-w-md space-y-4">
        <header className="rounded-2xl bg-white p-6 shadow-xl">
          <p className="text-sm font-semibold text-emerald-600">MediCare</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-600">Choose a new password for your account.</p>
        </header>

        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <form onSubmit={submit} className="space-y-4">
            {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            {success && <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>}
            <label className="relative block text-sm font-medium text-slate-700">
              New password
              <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-14 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100" autoComplete="new-password" required />
              <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-8 text-xs font-medium text-emerald-600">{showPassword ? "Hide" : "Show"}</button>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Confirm password
              <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100" autoComplete="new-password" required />
            </label>
            <button type="submit" disabled={loading || Boolean(success)} className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-600">
            Need a new link? <Link to="/forgot-password" className="font-semibold text-emerald-600 hover:text-emerald-700">Request one</Link>
          </div>
          <div className="mt-2 text-center text-sm text-slate-600">
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}