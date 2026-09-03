export default function AppointmentCard({ appointment }){
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="font-semibold">Your next appointment</div>
      <div className="mt-2 text-sm text-slate-600">{appointment.doctor} · {appointment.specialty}</div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="font-semibold">{appointment.date}</div>
          <div className="text-sm text-slate-600">{appointment.time}</div>
        </div>
        <div className="text-sm text-green-600 font-semibold">{appointment.status}</div>
      </div>
      <div className="mt-3">
        <button className="rounded-md bg-blue-600 text-white px-3 py-2">View Appointment</button>
      </div>
    </div>
  )
}
