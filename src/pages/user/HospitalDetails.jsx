import Navbar from '/src/components/dashboard/Navbar.jsx'
import { useParams } from 'react-router-dom'

export default function HospitalDetails(){
  const { id } = useParams()
  return (
    <div>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold">Central Medical Center</h1>
        <p className="text-sm text-slate-600 mt-1">Yaoundé · 4.8 ★</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div className="sm:col-span-2 rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="font-semibold">Overview</h3>
            <p className="mt-2 text-sm text-slate-600">Central Medical Center is a leading hospital offering a wide range of services including Cardiology, Pediatrics and Emergency care.</p>
          </div>

          <aside className="rounded-2xl bg-white p-4 shadow-sm">
            <h4 className="font-semibold">Quick Actions</h4>
            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md">Book Appointment</button>
          </aside>
        </div>
      </main>
    </div>
  )
}
