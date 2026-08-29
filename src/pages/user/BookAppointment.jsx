import { useMemo, useState, useEffect } from 'react'
import { CalendarDays, Clock3, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api.js'

const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM']

function to24Hour(time12h) {
  const [time, period] = time12h.split(' ')
  let [hours, minutes] = time.split(':').map(Number)
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
}

export default function BookAppointment() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00 AM')
  const [reason, setReason] = useState('')
  const [consultationType, setConsultationType] = useState('on_site')
  const [success, setSuccess] = useState(false)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await api.get(`/doctors/${doctorId}`)
        const doc = response.data?.data
        setDoctor(doc)

        try {
          const availRes = await api.get(`/availability/doctor/${doctorId}`)
          setAvailability(availRes.data?.availability || [])
        } catch {
          setAvailability([])
        }

        if (doc?.hospital?.id) {
          try {
            const docAvailRes = await api.get(`/doctors/${doctorId}`)
            setDoctor(docAvailRes.data?.data || doc)
          } catch {
            // ignore
          }
        }
      } catch {
        setError('Unable to load doctor information. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (doctorId) fetchDoctor()
  }, [doctorId])

  const today = useMemo(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  }, [])

  useEffect(() => {
    if (!date) setDate(today)
  }, [date, today])

  const confirmBooking = async () => {
    if (!doctor || !date || !time) return
    setBooking(true)
    setError('')
    try {
      await api.post('/appointments/book', {
        doctorId: Number(doctorId),
        hospitalId: doctor.hospital?.id || null,
        appointmentDate: date,
        appointmentTime: to24Hour(time),
        reason,
        consultationType,
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to book appointment. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">Loading doctor information...</div>
      </div>
    )
  }

  if (error && !doctor) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600">{error}</div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <div className="rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={34} /></div>
          <h1 className="mt-5 text-2xl font-extrabold">Appointment Confirmed</h1>
          <p className="mt-2 text-sm text-[#6E7B76]">Your appointment with {doctor?.name} has been saved.</p>
          <div className="mx-auto mt-5 max-w-md rounded-2xl bg-[#F5F7F6] p-5 text-left text-sm">
            <p><strong>Doctor:</strong> {doctor?.name}</p>
            <p className="mt-2"><strong>Date:</strong> {date}</p>
            <p className="mt-2"><strong>Time:</strong> {time}</p>
            <p className="mt-2"><strong>Type:</strong> {consultationType === 'online' ? 'Online Consultation' : 'On-site Consultation'}</p>
            <p className="mt-2"><strong>Location:</strong> {doctor?.hospital?.name || 'Hospital'}</p>
          </div>
          <button onClick={() => navigate('/appointments')} className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white">View My Appointments</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6E7B76] hover:text-emerald-600"><ArrowLeft size={17} /> Back</button>
      <h1 className="text-2xl font-extrabold tracking-tight">Book Appointment</h1>
      <p className="mt-1 text-sm text-[#6E7B76]">Choose a convenient date and time for your consultation.</p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-[#E7ECE9] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#98A29D]">Selected Doctor</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">{(doctor?.name || '').replace('Dr. ', '').split(' ').map(x => x[0]).join('')}</div>
            <div>
              <h2 className="font-bold">{doctor?.name}</h2>
              <p className="text-sm text-[#6E7B76]">{doctor?.specialty || 'General Practice'}</p>
              <p className="mt-1 text-xs text-[#6E7B76]"><MapPin size={12} className="mr-1 inline" />{doctor?.hospital?.name || 'Hospital'}</p>
            </div>
          </div>

          {availability.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#98A29D]">Availability</p>
              <div className="mt-2 space-y-1">
                {availability.map((a, idx) => (
                  <p key={idx} className="text-xs text-[#6E7B76]">{a.dayOfWeek}: {a.startTime} - {a.endTime}</p>
                ))}
              </div>
            </div>
          )}
          {availability.length === 0 && (
            <p className="mt-4 text-xs text-[#6E7B76]">No availability has been configured.</p>
          )}
        </div>

        <div className="rounded-2xl border border-[#E7ECE9] bg-white p-6 shadow-sm">
          <label className="block text-sm font-semibold">Select Date<input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E7ECE9] px-4 py-3 text-sm outline-none focus:border-emerald-500" /></label>
          <div className="mt-5"><p className="text-sm font-semibold">Select Time</p><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">{times.map(item => <button key={item} onClick={() => setTime(item)} className={`rounded-xl border px-3 py-3 text-xs font-semibold ${time === item ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-[#E7ECE9] hover:bg-emerald-50'}`}><Clock3 size={13} className="mx-auto mb-1" />{item}</button>)}</div></div>
          <label className="mt-5 block text-sm font-semibold">Reason for visit <span className="font-normal text-[#98A29D]">(optional)</span><textarea value={reason} onChange={e => setReason(e.target.value)} rows="3" placeholder="Briefly describe your reason for the visit..." className="mt-2 w-full resize-none rounded-xl border border-[#E7ECE9] px-4 py-3 text-sm outline-none focus:border-emerald-500" /></label>

          <div className="mt-5">
            <p className="text-sm font-semibold mb-2">Consultation Type</p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setConsultationType('online')} className={`rounded-xl border p-3 text-left text-xs transition ${consultationType === 'online' ? 'border-emerald-500 bg-emerald-50' : 'border-[#E7ECE9] hover:bg-emerald-50'}`}>
                <p className="font-semibold">Online Consultation</p>
                <p className="mt-1 text-[#6E7B76]">Video consultation with the doctor</p>
              </button>
              <button type="button" onClick={() => setConsultationType('on_site')} className={`rounded-xl border p-3 text-left text-xs transition ${consultationType === 'on_site' ? 'border-emerald-500 bg-emerald-50' : 'border-[#E7ECE9] hover:bg-emerald-50'}`}>
                <p className="font-semibold">On-site Consultation</p>
                <p className="mt-1 text-[#6E7B76]">Visit the doctor at the hospital</p>
              </button>
            </div>
          </div>

          <button onClick={confirmBooking} disabled={booking || !date || !time} className="mt-5 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{booking ? 'Booking...' : 'Confirm Appointment'}</button>
        </div>
      </div>
    </div>
  )
}

