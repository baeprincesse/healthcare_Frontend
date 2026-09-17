import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api.js'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [payments, setPayments] = useState([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)

  useEffect(() => {
    if (user?.role === "PATIENT") {
      setPaymentsLoading(true)
      api.get("/payments/history")
        .then(res => setPayments(res.data?.payments || []))
        .catch(() => setPayments([]))
        .finally(() => setPaymentsLoading(false))
    }
  }, [user])

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Protected dashboard</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Welcome back, {user?.name}</h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600">
                This is the authenticated dashboard view for {user?.role.toLowerCase()} users. Continue to your appointment workflows from here.
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Quick actions</h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li className="rounded-3xl bg-slate-50 p-4">View upcoming appointments</li>
              <li className="rounded-3xl bg-slate-50 p-4">Manage profile & availability</li>
              <li className="rounded-3xl bg-slate-50 p-4">Review messages and notes</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Your details</h2>
            <dl className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="rounded-3xl bg-slate-50 p-4">
                <dt className="font-medium text-slate-900">Email</dt>
                <dd className="mt-1">{user?.email}</dd>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <dt className="font-medium text-slate-900">Role</dt>
                <dd className="mt-1">{user?.role}</dd>
              </div>
              {user?.phone && (
                <div className="rounded-3xl bg-slate-50 p-4">
                  <dt className="font-medium text-slate-900">Phone</dt>
                  <dd className="mt-1">{user?.phone}</dd>
                </div>
              )}
              {user?.specialization && (
                <div className="rounded-3xl bg-slate-50 p-4">
                  <dt className="font-medium text-slate-900">Specialization</dt>
                  <dd className="mt-1">{user.specialization}</dd>
                </div>
              )}
            </dl>
          </div>

          {user?.role === "PATIENT" && (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">Recent Payments</h2>
              {paymentsLoading ? (
                <p className="mt-4 text-sm text-slate-500">Loading payment history...</p>
              ) : payments.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No payments found.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {payments.slice(0, 5).map(p => (
                    <div key={p.id} className="rounded-3xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{p.paymentMethod === "MTN" ? "MTN Mobile Money" : "Orange Money"}</p>
                          <p className="text-xs text-slate-500">{p.createdAt}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{p.amount} FCFA</p>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "SUCCESS" ? "bg-emerald-100 text-emerald-700" : p.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Resources</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <Link
                to="/"
                className="block rounded-3xl bg-slate-50 px-4 py-3 text-slate-700 transition hover:bg-slate-100"
              >
                Back to role selection
              </Link>
              <div className="rounded-3xl bg-sky-50 p-4 text-slate-900">
                <p className="font-semibold">Tip</p>
                <p className="mt-2 text-sm">Use the role selector page when switching between patient and doctor workflows.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
