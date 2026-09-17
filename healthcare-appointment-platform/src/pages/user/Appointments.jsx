import { CalendarDays, Clock3, MapPin, Search, Video, Loader2, FileText, BellRing } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../services/api.js'
import { useSocket } from '../../context/SocketContext.jsx'

export default function Appointments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { liveNotification, clearLiveNotification } = useSocket()

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

  const handleJoin = async (appointmentId, consultationType) => {
    try {
      if (consultationType === "ONLINE") {
        await api.get(`/appointments/${appointmentId}/join`)
        window.location.href = `/fronted/healthcare-appointment-platform/video-consultation/${appointmentId}`
      } else {
        window.location.href = `/fronted/healthcare-appointment-platform/onsite-consultation/${appointmentId}`
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to join consultation.')
    }
  }

  const dismissNotification = (e) => {
    e.preventDefault()
    clearLiveNotification()
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'DRAFT': return 'Draft'
      case 'PENDING': return 'Pending'
      case 'DISAPPROVED': return 'Disapproved'
      case 'CONFIRMED': return 'Confirmed'
      case 'RESCHEDULED': return 'Rescheduled'
      case 'REASSIGN': return 'Reassign'
      case 'IN_PROCESS': return 'In Process'
      case 'TERMINATED': return 'Terminated'
      case 'NO_SHOW': return 'No Show'
      default: return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return 'bg-slate-100 text-slate-600'
      case 'PENDING': return 'bg-amber-50 text-amber-700'
      case 'DISAPPROVED': return 'bg-red-50 text-red-700'
      case 'CONFIRMED': return 'bg-emerald-50 text-emerald-700'
      case 'RESCHEDULED': return 'bg-purple-50 text-purple-700'
      case 'REASSIGN': return 'bg-indigo-50 text-indigo-700'
      case 'IN_PROCESS': return 'bg-blue-50 text-blue-700'
      case 'TERMINATED': return 'bg-gray-100 text-gray-600'
      case 'NO_SHOW': return 'bg-red-50 text-red-700'
      default: return 'bg-emerald-50 text-emerald-700'
    }
  }

  const upcomingItems = items.filter((item) => item.status === 'PENDING' && getAppointmentDate(item) >= new Date())
  const nextAppointment = [...upcomingItems].sort((a, b) => getAppointmentDate(a) - getAppointmentDate(b))[0]

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-2xl font-extrabold">My Appointments</h1><p className="mt-1 text-sm text-[#6E7B76]">Manage your upcoming and previous appointments.</p></div><Link to="/find-doctor" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"><Search size={16} /> Find a Doctor</Link></div>

      {liveNotification && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">🔔</span>
            <span className="font-medium text-emerald-800">{liveNotification.message}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleJoin(liveNotification.appointmentId, liveNotification.consultationType)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              {liveNotification.consultationType === "ONLINE" ? "Join Now" : "View Consultation"}
            </button>
            <button onClick={dismissNotification} className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold">Dismiss</button>
          </div>
        </div>
      )}

      {nextAppointment && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"><BellRing size={21} /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Your next appointment</p>
            <p className="mt-1 text-sm font-bold text-amber-950">{getReminderLabel(nextAppointment)} at {nextAppointment.appointmentTime} with {nextAppointment.doctor?.name || 'your doctor'}</p>
            <p className="mt-1 text-xs text-amber-800">Please keep this time available for your consultation.</p>
          </div>
        </div>
      )}

      {loading && <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">Loading appointments...</div>}

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">No appointments found. Book your first appointment to get started.</div>
      )}

      <div className="space-y-3">{items.map(item => (
        <div key={item.id} className={`rounded-2xl border p-5 shadow-sm ${item.status === 'PENDING' && isWithin24Hours(item) ? 'border-amber-300 bg-amber-50/50' : 'border-[#E7ECE9] bg-white'}`}>
          {item.status === 'PENDING' && isWithin24Hours(item) && <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-700"><BellRing size={14} /> Reminder: appointment is within 24 hours</div>}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">{item.doctor?.name || 'Doctor'}</h2>
              <p className="text-sm text-[#6E7B76]">{item.doctor?.specialty || ''}</p>
              <p className="mt-1 text-xs text-emerald-700 font-medium">{item.consultationType === 'ONLINE' ? 'Online Consultation' : 'On-site Consultation'}</p>
              {item.consultationType === 'ONLINE' && item.status === 'PENDING' && (
                <p className="mt-1 flex items-center gap-1 text-xs text-amber-600"><Loader2 size={12} className="animate-spin" /> Waiting for doctor to start...</p>
              )}
              {item.consultationType === 'ONLINE' && item.status === 'IN_PROCESS' && (
                <p className="mt-1 text-xs text-emerald-600 font-medium">Doctor has started the consultation</p>
              )}
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#6E7B76]">
                <span><CalendarDays size={13} className="mr-1 inline" />{item.appointmentDate}</span>
                <span><Clock3 size={13} className="mr-1 inline" />{item.appointmentTime} - {item.endTime || ''}</span>
                <span><MapPin size={13} className="mr-1 inline" />{item.hospital?.name || 'Hospital'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.consultationType === 'ONLINE' && item.jitsiMeetingUrl && (
                item.status === 'PENDING' ? (
                  <button disabled className="inline-flex items-center gap-1 rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 cursor-not-allowed"><Video size={13} /> Waiting...</button>
                ) : item.status === 'IN_PROCESS' ? (
                  <button onClick={() => handleJoin(item.id, item.consultationType)} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"><Video size={13} /> Join Video Consultation</button>
                ) : null
              )}
              {item.consultationType === 'ON_SITE' && item.status === 'IN_PROCESS' && (
                <button onClick={() => handleJoin(item.id, item.consultationType)} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"><FileText size={13} /> View Consultation</button>
              )}
              {item.consultationType === 'ON_SITE' && item.status === 'PENDING' && (
                <span className="text-xs text-amber-600 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Waiting for doctor...</span>
              )}
              <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(item.status)}`}>{getStatusLabel(item.status)}</span>
            </div>
          </div>
        </div>
      ))}</div>
    </div>
  )
}

    function getAppointmentDate(appointment) {
      return new Date(`${appointment.appointmentDate}T${appointment.appointmentTime || '00:00:00'}`)
    }

    function isWithin24Hours(appointment) {
      const difference = getAppointmentDate(appointment).getTime() - Date.now()
      return difference >= 0 && difference <= 24 * 60 * 60 * 1000
    }

    function getReminderLabel(appointment) {
      const appointmentDate = getAppointmentDate(appointment)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      if (appointmentDate.toDateString() === today.toDateString()) return 'Today'
      if (appointmentDate.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
      return appointment.appointmentDate
    }
