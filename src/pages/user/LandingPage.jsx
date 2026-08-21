import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import HospitalCard from '../../components/HospitalCard.jsx'
import DoctorCard from '../../components/DoctorCard.jsx'
import SearchBar from '../../components/SearchBar.jsx'

const hospitals = [
  { id:1, name:'Central Medical Center', city:'Yaoundé', services:['Cardiology','Pediatrics','Emergency'], rating:4.8 },
  { id:2, name:'CityCare Hospital', city:'Douala', services:['General Medicine','Surgery','Laboratory'], rating:4.7 },
  { id:3, name:'Green Valley Medical Center', city:'Bamenda', services:['Pediatrics','Maternity','Pharmacy'], rating:4.6 },
]

const doctors = [
  { id:1, name:'Dr. Sarah Johnson', specialty:'Cardiology', hospital:'Central Medical Center', rating:4.9, nextAvailable:'Mon 10:30' },
  { id:2, name:'Dr. Paul Mbarga', specialty:'Pediatrics', hospital:'Green Valley Medical Center', rating:4.7, nextAvailable:'Tue 09:00' },
  { id:3, name:'Dr. Anne K.', specialty:'General Medicine', hospital:'CityCare Hospital', rating:4.6, nextAvailable:'Wed 14:00' },
]

export default function LandingPage(){
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />

      <header className="max-w-7xl mx-auto px-6 py-10 grid gap-8 lg:grid-cols-2 items-center">
        <div>
          <div className="inline-flex items-center gap-3 text-sm text-green-600 font-semibold">Trusted by 10,000+ patients</div>
          <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold leading-tight">Healthcare, <span className="text-green-600">made easier.</span></h1>
          <p className="mt-4 text-slate-600 max-w-xl">Find the right hospital or doctor, check availability and book appointments fast — all in one simple platform.</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="rounded-lg bg-green-600 px-5 py-3 text-white shadow hover:bg-green-700">Find a Doctor</button>
            <button className="rounded-lg bg-white border border-slate-200 px-5 py-3 text-slate-700">Book an Appointment</button>
          </div>

          {/* <div className="mt-8">
            <SearchBar />
          </div> */}

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg bg-white p-4 shadow-sm text-center">
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-sm text-slate-600">Happy Patients</div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm text-center">
              <div className="text-2xl font-bold">2,500+</div>
              <div className="text-sm text-slate-600">Hospitals</div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm text-center">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-slate-600">Doctors</div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm text-center">
              <div className="text-2xl font-bold">25,000+</div>
              <div className="text-sm text-slate-600">Appointments Booked</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            <div className="bg-green-50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Upcoming</div>
                  <div className="font-semibold">Dr. Sarah Johnson</div>
                  <div className="text-sm text-slate-600">Cardiology · Central Medical Center</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">Mon</div>
                  <div className="font-semibold">10:30 AM</div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-lg bg-white p-4 shadow-sm"> 
                <div className="font-semibold">Search by specialty, doctor or hospital</div>
                <div className="text-sm text-slate-500">Quickly find the care you need</div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm"> 
                <div className="font-semibold">Real-time availability</div>
                <div className="text-sm text-slate-500">See open slots instantly</div>
              </div>
            </div>
          </div>

          {/* <div className="absolute -bottom-6 left-6 w-64 rounded-lg bg-white p-4 shadow-lg">
            <div className="font-semibold">Book instantly</div>
            <div className="text-sm text-slate-600">Confirm appointments in seconds</div>
            <div className="mt-3"><button className="w-full bg-green-600 text-white py-2 rounded-md">Get Started</button></div>
          </div> */}
      
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <section>
          <h2 className="text-2xl font-semibold">Everything you need for better healthcare</h2>
          <p className="text-sm text-slate-600 mt-1">Search, book, and manage appointments with ease.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="font-semibold">Find Hospitals</div>
              <p className="text-sm text-slate-600 mt-2">Search hospitals and explore services and specialties.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="font-semibold">Find Doctors</div>
              <p className="text-sm text-slate-600 mt-2">Discover doctors by specialty and availability.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="font-semibold">Book Appointments</div>
              <p className="text-sm text-slate-600 mt-2">Choose a convenient time and book quickly.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="font-semibold">Manage Your Healthcare</div>
              <p className="text-sm text-slate-600 mt-2">Keep track of appointments and activity in one place.</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold">Discover hospitals near you</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hospitals.map(h=> <HospitalCard key={h.id} hospital={h} />)}
          </div>
        </section>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold">Find the right doctor</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map(d=> <DoctorCard key={d.id} doctor={d} />)}
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-green-600 text-white p-8">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-semibold">Better healthcare starts with a simpler experience.</h3>
            <p className="mt-2 text-slate-100">Create your MediConnect account and start discovering healthcare today.</p>
            <div className="mt-4"><button className="bg-white text-green-600 px-4 py-2 rounded-md">Get Started</button></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
