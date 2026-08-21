import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function DashboardPage() {
  const { user, logout } = useAuth()

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
                  <dd className="mt-1">{user.phone}</dd>
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
