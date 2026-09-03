import { useMemo, useState, useEffect } from 'react'
import { CalendarDays, Clock3, MapPin, ArrowLeft, CheckCircle2, Loader2, ShieldCheck, AlertCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api.js'

export default function BookAppointment() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [availableDates, setAvailableDates] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [reason, setReason] = useState('')
  const [consultationType, setConsultationType] = useState('ONLINE')
  const [paymentMethod, setPaymentMethod] = useState('MTN_MOMO')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [appointmentId, setAppointmentId] = useState(null)
  const [paymentStep, setPaymentStep] = useState(false)
  const [paymentInitiating, setPaymentInitiating] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [booking, setBooking] = useState(false)
  const [slotsLoading, setSlotsLoading] = useState(false)

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await api.get(`/doctors/${doctorId}`)
        const doc = response.data?.data
        setDoctor(doc)

        if (doc?.hospital?.id) {
          try {
            const datesRes = await api.get(`/availability/doctor/${doctorId}/dates?hospitalId=${doc.hospital.id}`)
            setAvailableDates(datesRes.data?.data || [])
          } catch {
            setAvailableDates([])
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

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !doctor?.hospital?.id) {
        setAvailableSlots([])
        return
      }
      setSlotsLoading(true)
      try {
        const slotsRes = await api.get(`/availability/doctor/${doctorId}/slots?hospitalId=${doctor.hospital.id}&date=${selectedDate}`)
        setAvailableSlots(slotsRes.data?.data || [])
      } catch {
        setAvailableSlots([])
      } finally {
        setSlotsLoading(false)
      }
    }
    fetchSlots()
  }, [selectedDate, doctor])

  const confirmBooking = async () => {
    if (!doctor || !selectedDate || !selectedSlot) return
    setBooking(true)
    setError('')
    try {
      const resp = await api.post('/appointments/book', {
        doctorId: Number(doctorId),
        hospitalId: doctor.hospital?.id || null,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot.startTime,
        reason,
        consultationType,
      })
      const appointment = resp.data?.appointment || resp.data
      setAppointmentId(appointment?.id || appointment?.data?.id)
      setBooking(false)
      if (consultationType === 'ONLINE') {
        setPaymentStep(true)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setBooking(false)
      setError(err.response?.data?.message || 'Unable to book appointment. Please try again.')
    }
  }

  const initPayment = async () => {
    if (!selectedDate || !selectedSlot) return
    setPaymentError('')
    if (!phoneNumber || phoneNumber.length < 8) {
      setPaymentError('Please enter a valid phone number.')
      return
    }
    setPaymentInitiating(true)
    try {
      const resp = await api.post('/payments/initiate', {
        appointmentId,
        paymentMethod,
        phoneNumber,
      })
      if (resp.data?.success) {
        setSuccess(resp.data.payment?.status === 'PAID')
        if (resp.data.payment?.status !== 'PAID') {
          setPaymentError('Payment initiated. Confirm it on your phone, then verify the payment.')
        }
      } else {
        setPaymentError(resp.data?.message || 'Payment initiation failed. Please try again.')
      }
    } catch (err) {
      setPaymentError(err.response?.data?.message || 'Unable to initiate payment. Please try again.')
    } finally {
      setPaymentInitiating(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
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
            <p className="mt-2"><strong>Date:</strong> {selectedDate}</p>
            <p className="mt-2"><strong>Time:</strong> {selectedSlot?.startTime} - {selectedSlot?.endTime}</p>
            <p className="mt-2"><strong>Type:</strong> {consultationType === 'ONLINE' ? 'Online Consultation' : 'On-site Consultation'}</p>
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

          {availableDates.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#98A29D]">Available Dates</p>
              <div className="mt-2 space-y-1">
                {availableDates.slice(0, 5).map((d) => (
                  <p key={d} className="text-xs text-[#6E7B76]">{d}</p>
                ))}
              </div>
            </div>
          )}
          {availableDates.length === 0 && (
            <p className="mt-4 text-xs text-[#6E7B76]">No availability has been configured for this doctor.</p>
          )}
        </div>

        <div className="rounded-2xl border border-[#E7ECE9] bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm font-semibold mb-2">Choose Date</p>
            {availableDates.length === 0 ? (
              <p className="text-xs text-[#6E7B76]">No dates available.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {availableDates.map((d) => (
                  <button
                    key={d}
                    onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                    className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${selectedDate === d ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-[#E7ECE9] hover:bg-emerald-50'}`}
                  >
                    <CalendarDays size={13} className="mx-auto mb-1" />
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedDate && (
            <div className="mb-5">
              <p className="text-sm font-semibold mb-2">Select Time Slot</p>
              {slotsLoading ? (
                <p className="text-xs text-[#6E7B76] flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Loading slots...</p>
              ) : availableSlots.length === 0 ? (
                <p className="text-xs text-[#6E7B76]">No available slots for this date.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {availableSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${selectedSlot === slot ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-[#E7ECE9] hover:bg-emerald-50'}`}
                    >
                      <Clock3 size={13} className="mx-auto mb-1" />
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <label className="block text-sm font-semibold">Reason for visit <span className="font-normal text-[#98A29D]">(optional)</span><textarea value={reason} onChange={e => setReason(e.target.value)} rows="3" placeholder="Briefly describe your reason for the visit..." className="mt-2 w-full resize-none rounded-xl border border-[#E7ECE9] px-4 py-3 text-sm outline-none focus:border-emerald-500" /></label>

          <div className="mt-5">
            <p className="text-sm font-semibold mb-2">Consultation Type</p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setConsultationType('ONLINE')} className={`rounded-xl border p-3 text-left text-xs transition ${consultationType === 'ONLINE' ? 'border-emerald-500 bg-emerald-50' : 'border-[#E7ECE9] hover:bg-emerald-50'}`}>
                <p className="font-semibold">Online Consultation</p>
                <p className="mt-1 text-[#6E7B76]">Video consultation with the doctor</p>
              </button>
              <button type="button" onClick={() => setConsultationType('ON_SITE')} className={`rounded-xl border p-3 text-left text-xs transition ${consultationType === 'ON_SITE' ? 'border-emerald-500 bg-emerald-50' : 'border-[#E7ECE9] hover:bg-emerald-50'}`}>
                <p className="font-semibold">On-site Consultation</p>
                <p className="mt-1 text-[#6E7B76]">Visit the doctor at the hospital</p>
              </button>
            </div>
          </div>

          {consultationType === 'ONLINE' && paymentStep && (
            <div className="mt-5 rounded-xl border border-[#E7ECE9] bg-[#F5F7F6] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Consultation Fee</p>
                <p className="text-sm font-bold text-emerald-700">{doctor?.consultationFee ? formatCurrency(doctor.consultationFee) : '5,000 FCFA'}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase text-[#98A29D]">Payment Method</p>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <button onClick={() => setPaymentMethod('MTN_MOMO')} className={`rounded-lg border p-2 text-xs font-semibold ${paymentMethod === 'MTN_MOMO' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-[#E7ECE9]'}`}>MTN Mobile Money</button>
                    <button onClick={() => setPaymentMethod('ORANGE_MONEY')} className={`rounded-lg border p-2 text-xs font-semibold ${paymentMethod === 'ORANGE_MONEY' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-[#E7ECE9]'}`}>Orange Money</button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-[#98A29D]">Phone Number</p>
                  <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="e.g. 6XXXXXXXX" type="tel" className="mt-1 w-full rounded-xl border border-[#E7ECE9] px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                </div>
                {paymentError && (
                  <div className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1.5 text-xs text-red-600"><AlertCircle size={12} />{paymentError}</div>
                )}
              </div>
              <button onClick={initPayment} disabled={paymentInitiating} className="mt-3 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{paymentInitiating ? 'Processing...' : 'Pay Now'}</button>
            </div>
          )}

          {!paymentStep && (
            <button onClick={confirmBooking} disabled={booking || !selectedDate || !selectedSlot} className="mt-5 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{booking ? 'Booking...' : 'Confirm Appointment'}</button>
          )}
        </div>
      </div>
    </div>
  )
}
