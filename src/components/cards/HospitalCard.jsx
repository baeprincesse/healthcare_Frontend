export default function HospitalCard({ hospital }){
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{hospital.name}</div>
          <div className="text-sm text-slate-600">{hospital.city}</div>
        </div>
        <div className="text-sm text-slate-700 font-semibold">{hospital.rating} ★</div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {hospital.services.map(s=> (<span key={s} className="text-sm bg-slate-50 px-2 py-1 rounded">{s}</span>))}
      </div>
      <div className="mt-3">
        <button className="rounded-md bg-green-600 text-white px-3 py-2">View Hospital</button>
      </div>
    </div>
  )
}
