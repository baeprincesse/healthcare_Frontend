export default function DoctorCard({ doctor }){
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">MD</div>
        <div>
          <div className="font-semibold">{doctor.name}</div>
          <div className="text-sm text-slate-600">{doctor.specialty} · {doctor.hospital}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-slate-700">{doctor.nextAvailable}</div>
        <div className="text-sm text-slate-700 font-semibold">{doctor.rating} ★</div>
      </div>
      <div className="mt-3">
        <button className="rounded-md bg-green-600 text-white px-3 py-2">View Profile</button>
      </div>
    </div>
  )
}
