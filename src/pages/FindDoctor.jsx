import { useMemo, useState } from 'react'
import { Filter, MapPin, Search, Star, CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const DOCTORS = [
  { id: 1, name: 'Dr. Marie Essomba', specialty: 'Cardiologist', rating: 4.8, reviews: 120, availability: 'Available Today', nextSlot: '2:00 PM', hospital: 'Harmony Hospital', distance: '1.2 km' },
  { id: 2, name: 'Dr. Alain Kamga', specialty: 'Dermatologist', rating: 4.6, reviews: 98, availability: 'Available Today', nextSlot: '11:00 AM', hospital: 'Hope Medical Center', distance: '2.1 km' },
  { id: 3, name: 'Dr. Nadia Fouda', specialty: 'Pediatrician', rating: 4.9, reviews: 150, availability: 'Available Tomorrow', nextSlot: '9:00 AM', hospital: 'Life Care Clinic', distance: '3.4 km' },
  { id: 4, name: 'Dr. Paul Nguim', specialty: 'Dermatologist', rating: 4.6, reviews: 77, availability: 'Available Fri, May 24', nextSlot: '12:00 PM', hospital: 'Hope Medical Center', distance: '4.0 km' },
]

const specialties = ['All', 'General Practice', 'Cardiology', 'Dermatology', 'Pediatrics', 'Gynecology', 'Neurology']

export default function FindDoctor() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('All')
  const [location, setLocation] = useState('Yaoundé, Cameroon')

  const filtered = useMemo(() => DOCTORS.filter(d => {
    const matchesQuery = `${d.name} ${d.specialty} ${d.hospital}`.toLowerCase().includes(query.toLowerCase())
    const matchesSpecialty = specialty === 'All' || d.specialty === specialty
    return matchesQuery && matchesSpecialty
  }), [query, specialty])

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
            <input value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-transparent text-sm outline-none" />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"><Filter size={16} /> Filter</button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {specialties.map(item => <button key={item} onClick={() => setSpecialty(item)} className={`rounded-full px-4 py-2 text-xs font-semibold ${specialty === item ? 'bg-emerald-600 text-white' : 'bg-[#F5F7F6] text-[#6E7B76] hover:bg-emerald-50'}`}>{item}</button>)}
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {filtered.map(doctor => (
          <div key={doctor.id} className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">{doctor.name.replace('Dr. ', '').split(' ').map(x => x[0]).join('')}</div>
                <div>
                  <h2 className="font-bold">{doctor.name}</h2>
                  <p className="text-sm text-[#6E7B76]">{doctor.specialty}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#6E7B76]">
                    <span className="inline-flex items-center gap-1"><Star size={13} className="fill-amber-400 text-amber-400" /> {doctor.rating} ({doctor.reviews} reviews)</span>
                    <span><MapPin size={12} className="mr-1 inline" />{doctor.hospital} · {doctor.distance}</span>
                  </div>
                </div>
              </div>
              <div className="lg:text-right">
                <p className="text-xs font-semibold text-emerald-600">{doctor.availability}</p>
                <p className="mt-1 text-xs text-[#6E7B76]">Next: {doctor.nextSlot}</p>
              </div>
              <button onClick={() => navigate(`/appointments/book/${doctor.id}`)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"><CalendarDays size={16} /> Book Appointment</button>
            </div>
          </div>
        ))}
      </div>
      {!filtered.length && <div className="mt-5 rounded-2xl border border-dashed border-[#C9D4CF] bg-white p-10 text-center text-sm text-[#6E7B76]">No doctors match your search.</div>}
    </div>
  )
}
