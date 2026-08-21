import { CalendarDays, CheckCircle2, FileText, Pill, ArrowRight, Search, UploadCloud, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import logo from "../assets/logo.jpg";

const stats = [
  { label: 'Upcoming Appointments', value: 2, icon: CalendarDays, tint: 'bg-blue-50 text-blue-600' },
  { label: 'Completed Appointments', value: 8, icon: CheckCircle2, tint: 'bg-emerald-50 text-emerald-600' },
  { label: 'Prescriptions', value: 3, icon: Pill, tint: 'bg-amber-50 text-amber-600' },
  { label: 'Medical Records', value: 5, icon: FileText, tint: 'bg-indigo-50 text-indigo-600' },
]

const appointments = [
  { doctor: 'Dr. Alain Kamga', specialty: 'Cardiologist', date: 'May 22, 2026', time: '10:00 AM', hospital: 'Harmony Hospital', status: 'Confirmed' },
  { doctor: 'Dr. Nadia Fouda', specialty: 'Pediatrician', date: 'May 30, 2026', time: '2:00 PM', hospital: 'Life Care Clinic', status: 'Upcoming' },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">Welcome back, {user?.name || 'Patient'} 👋</h1>
          <p className="mt-1 text-sm text-[#6E7B76]">Take care of your health today.</p>
        </div>
        <Link to="/find-doctor" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
          <Search size={17} /> Find a Doctor
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}><Icon size={19} /></div>
            <p className="text-sm text-[#6E7B76]">{label}</p>
            <p className="mt-1 text-2xl font-extrabold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Upcoming Appointments</h2>
            <Link to="/appointments" className="text-sm font-semibold text-emerald-600">View all</Link>
          </div>
          <div className="space-y-3">
            {appointments.map((item) => (
              <div key={item.doctor} className="flex flex-col gap-4 rounded-xl border border-[#E7ECE9] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">{item.doctor.replace('Dr. ', '').split(' ').map(x => x[0]).join('')}</div>
                  <div>
                    <p className="font-semibold">{item.doctor}</p>
                    <p className="text-sm text-[#6E7B76]">{item.specialty}</p>
                    <p className="mt-1 text-xs text-[#6E7B76]">{item.date} · {item.time} · {item.hospital}</p>
                  </div>
                </div>
                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
          <h2 className="font-bold">Quick Actions</h2>
          <div className="mt-4 space-y-2">
            <QuickAction to="/find-doctor" icon={Search} label="Find Doctors" />
            <QuickAction to="/appointments/book/1" icon={CalendarDays} label="Book Appointment" />
            <QuickAction to="/medical-records" icon={UploadCloud} label="View Medical Records" />
            <QuickAction to="/payments" icon={CreditCard} label="Make Payment" />
          </div>
          <div className="mt-5 rounded-xl bg-emerald-600 p-4 text-white">
            <p className="font-bold">Your Health Matters</p>
            <p className="mt-1 text-sm text-emerald-50">Keep your health information updated and accessible in one secure place.</p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[#E7ECE9] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Start your next healthcare journey</h2>
          <ArrowRight className="text-emerald-600" size={20} />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Link to="/find-doctor" className="rounded-xl bg-[#F5F7F6] p-4 hover:bg-emerald-50"><p className="font-semibold">Find a nearby doctor</p><p className="mt-1 text-xs text-[#6E7B76]">Search by specialty and location.</p></Link>
          <Link to="/appointments" className="rounded-xl bg-[#F5F7F6] p-4 hover:bg-emerald-50"><p className="font-semibold">Manage appointments</p><p className="mt-1 text-xs text-[#6E7B76]">See upcoming and previous visits.</p></Link>
          <Link to="/medical-records" className="rounded-xl bg-[#F5F7F6] p-4 hover:bg-emerald-50"><p className="font-semibold">Open medical records</p><p className="mt-1 text-xs text-[#6E7B76]">Keep your e-medical record organized.</p></Link>
        </div>
      </section>
    </div>
  )
}

function QuickAction({ to, icon: Icon, label }) {
  return <Link to={to} className="flex items-center gap-3 rounded-xl border border-[#E7ECE9] px-4 py-3 text-sm font-medium hover:border-emerald-200 hover:bg-emerald-50"><Icon size={18} className="text-emerald-600" /><span>{label}</span><ArrowRight size={15} className="ml-auto text-[#98A29D]" /></Link>
}
