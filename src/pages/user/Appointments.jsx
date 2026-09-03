import { CalendarDays, Clock3, MapPin, Search, Video } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../services/api.js'

export default function Appointments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await api.get('/appointments/my')
        setItems(response.data?.data || [])
      } catch {
        setError('Unable to load appointments.')
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [])

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-2xl font-extrabold">My Appointments</h1><p className="mt-1 text-sm text-[#6E7B76]">Manage your upcoming and previous appointments.</p></div><Link to="/find-doctor" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"><Search size={16} /> Find a Doctor</Link></div>

      {loading && <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">Loading appointments...</div>}

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">No appointments found. Book your first appointment to get started.</div>
      )}

      <div className="space-y-3">{items.map(item => (
        <div key={item.id} className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">{item.doctor?.name || 'Doctor'}</h2>
              <p className="text-sm text-[#6E7B76]">{item.doctor?.specialty || ''}</p>
              <p className="mt-1 text-xs text-emerald-700 font-medium">{item.consultationType === 'online' ? 'Online Consultation' : 'On-site Consultation'}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#6E7B76]">
                <span><CalendarDays size={13} className="mr-1 inline" />{item.appointmentDate}</span>
                <span><Clock3 size={13} className="mr-1 inline" />{item.appointmentTime}</span>
                <span><MapPin size={13} className="mr-1 inline" />{item.hospital?.name || 'Hospital'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.consultationType === 'online' && item.jitsiMeetingUrl && (
                <Link to={`/video-consultation/${item.id}`} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"><Video size={13} /> Join Video Consultation</Link>
              )}
              <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{item.status}</span>
            </div>
          </div>
        </div>
      ))}</div>
    </div>
  )
}

