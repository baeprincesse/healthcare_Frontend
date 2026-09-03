import { useMemo, useState, useEffect, useCallback } from 'react'
import { MapPin, Search, Star, CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

export default function FindDoctor() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('All')
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDoctors = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/doctors')
      setDoctors(response.data?.data || [])
    } catch {
      setError('Unable to load doctors. Please try again later.')
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  const specialties = useMemo(() => {
    const set = new Set(doctors.map((d) => d.specialty).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [doctors])

  const filtered = useMemo(() => doctors.filter(d => {
    const matchesQuery = `${d.name} ${d.specialty} ${d.hospital?.name || ''}`.toLowerCase().includes(query.toLowerCase())
    const matchesSpecialty = specialty === 'All' || d.specialty === specialty
    return matchesQuery && matchesSpecialty
  }), [query, specialty, doctors])

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">Find Doctors</h1>
        <p className="mt-1 text-sm text-[#6E7B76]">Search and book appointments with trusted doctors near you.</p>
      </div>

      <div className="rounded-2xl border border-[#E7ECE9] bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_auto]">
          <div className="flex items-center gap-2 rounded-xl border border-[#E7ECE9] px-4 py-3">
            <Search size={17} className="text-[#98A29D]" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, specialty or hospital..." className="w-full bg-transparent text-sm outline-none" />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#E7ECE9] px-4 py-3">
            <MapPin size={17} className="text-emerald-600" />
            <input readOnly value="Cameroon" className="w-full bg-transparent text-sm outline-none" />
          </div>
          <button onClick={fetchDoctors} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"><Search size={16} /> Search</button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {specialties.map(item => <button key={item} onClick={() => setSpecialty(item)} className={`rounded-full px-4 py-2 text-xs font-semibold ${specialty === item ? 'bg-emerald-600 text-white' : 'bg-[#F5F7F6] text-[#6E7B76] hover:bg-emerald-50'}`}>{item}</button>)}
        </div>
      </div>

      {loading && <div className="mt-5 rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">Loading doctors...</div>}

      {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">No doctors are currently available.</div>
      )}

      <div className="mt-5 grid gap-3">
        {filtered.map(doctor => (
          <div key={doctor.id} className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">{(doctor.name || '').replace('Dr. ', '').split(' ').map(x => x[0]).join('')}</div>
                <div>
                  <h2 className="font-bold">{doctor.name}</h2>
                  <p className="text-sm text-[#6E7B76]">{doctor.specialty || 'General Practice'}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#6E7B76]">
                    <span><MapPin size={12} className="mr-1 inline" />{doctor.hospital?.name || 'Hospital'}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => navigate(`/appointments/book/${doctor.id}`)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"><CalendarDays size={16} /> Book Appointment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

