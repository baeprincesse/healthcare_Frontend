import { CalendarDays, Clock3, MapPin, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const fallback = [{ id: 1, doctor: 'Dr. Alain Kamga', specialty: 'Cardiologist', hospital: 'Harmony Hospital', date: '2026-08-30', time: '10:30 AM', status: 'Upcoming' }]

export default function Appointments() {
  const items = JSON.parse(localStorage.getItem('carelink_appointments') || 'null') || fallback
  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-2xl font-extrabold">My Appointments</h1><p className="mt-1 text-sm text-[#6E7B76]">Manage your upcoming and previous appointments.</p></div><Link to="/find-doctor" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"><Search size={16} /> Find a Doctor</Link></div>
      <div className="space-y-3">{items.map(item => <div key={item.id} className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold">{item.doctor}</h2><p className="text-sm text-[#6E7B76]">{item.specialty}</p><div className="mt-2 flex flex-wrap gap-3 text-xs text-[#6E7B76]"><span><CalendarDays size={13} className="mr-1 inline" />{item.date}</span><span><Clock3 size={13} className="mr-1 inline" />{item.time}</span><span><MapPin size={13} className="mr-1 inline" />{item.hospital}</span></div></div><span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{item.status}</span></div></div>)}</div>
    </div>
  )
}
