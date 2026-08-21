import { useMemo, useState } from 'react'
import { CalendarDays, Clock3, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { DOCTORS } from './FindDoctor.jsx'

const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM']

export default function BookAppointment() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const doctor = useMemo(() => DOCTORS.find(d => String(d.id) === String(doctorId)) || DOCTORS[0], [doctorId])
  const [date, setDate] = useState('2026-08-25')
  const [time, setTime] = useState('10:00 AM')
  const [reason, setReason] = useState('')
  const [success, setSuccess] = useState(false)

  const confirmBooking = () => {
    const booking = { id: Date.now(), doctorId: doctor.id, doctor: doctor.name, specialty: doctor.specialty, hospital: doctor.hospital, date, time, reason, status: 'Confirmed' }
    const existing = JSON.parse(localStorage.getItem('carelink_appointments') || '[]')
    localStorage.setItem('carelink_appointments', JSON.stringify([booking, ...existing]))
    setSuccess(true)
  }

  if (success) return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={34} /></div>
        <h1 className="mt-5 text-2xl font-extrabold">Appointment Confirmed</h1>
        <p className="mt-2 text-sm text-[#6E7B76]">Your appointment with {doctor.name} has been saved.</p>
        <div className="mx-auto mt-5 max-w-md rounded-2xl bg-[#F5F7F6] p-5 text-left text-sm">
          <p><strong>Doctor:</strong> {doctor.name}</p><p className="mt-2"><strong>Date:</strong> {date}</p><p className="mt-2"><strong>Time:</strong> {time}</p><p className="mt-2"><strong>Location:</strong> {doctor.hospital}</p>
        </div>
        <button onClick={() => navigate('/appointments')} className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white">View My Appointments</button>
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl">
      <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#6E7B76] hover:text-emerald-600"><ArrowLeft size={17} /> Back</button>
      <h1 className="text-2xl font-extrabold tracking-tight">Book Appointment</h1>
      <p className="mt-1 text-sm text-[#6E7B76]">Choose a convenient date and time for your consultation.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-[#E7ECE9] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#98A29D]">Selected Doctor</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">{doctor.name.replace('Dr. ', '').split(' ').map(x => x[0]).join('')}</div>
            <div><h2 className="font-bold">{doctor.name}</h2><p className="text-sm text-[#6E7B76]">{doctor.specialty}</p><p className="mt-1 text-xs text-[#6E7B76]"><MapPin size={12} className="mr-1 inline" />{doctor.hospital}</p></div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7ECE9] bg-white p-6 shadow-sm">
          <label className="block text-sm font-semibold">Select Date<input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E7ECE9] px-4 py-3 text-sm outline-none focus:border-emerald-500" /></label>
          <div className="mt-5"><p className="text-sm font-semibold">Select Time</p><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">{times.map(item => <button key={item} onClick={() => setTime(item)} className={`rounded-xl border px-3 py-3 text-xs font-semibold ${time === item ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-[#E7ECE9] hover:bg-emerald-50'}`}><Clock3 size={13} className="mx-auto mb-1" />{item}</button>)}</div></div>
          <label className="mt-5 block text-sm font-semibold">Reason for visit <span className="font-normal text-[#98A29D]">(optional)</span><textarea value={reason} onChange={e => setReason(e.target.value)} rows="3" placeholder="Briefly describe your reason for the visit..." className="mt-2 w-full resize-none rounded-xl border border-[#E7ECE9] px-4 py-3 text-sm outline-none focus:border-emerald-500" /></label>
          <button onClick={confirmBooking} className="mt-5 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700">Confirm Appointment</button>
        </div>
      </div>
    </div>
  )
}
