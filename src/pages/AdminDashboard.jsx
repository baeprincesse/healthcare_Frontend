import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [doctors] = useState([
    { id: 1, name: 'Dr. Emily Carter', specialty: 'Cardiology' },
    { id: 2, name: 'Dr. Marcus Li', specialty: 'Pediatrics' },
  ])

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-slate-600">Welcome, {user?.name || 'Admin'}</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Manage Doctors</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {doctors.map((d) => (
                <li key={d.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-slate-500">{d.specialty}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-amber-600">Edit</button>
                    <button className="text-sm text-red-600">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Appointments & Availabilities</h2>
            <p className="mt-2 text-sm text-slate-600">View and manage upcoming appointments and provider availabilities.</p>
            <div className="mt-4 text-sm">
              <button className="rounded-md bg-sky-600 px-3 py-1 text-white">View schedule</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
