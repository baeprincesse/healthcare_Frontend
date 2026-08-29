export default function FeatureCard({ icon, title, description }){
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-slate-50 flex items-center justify-center">{icon}</div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-slate-600">{description}</div>
        </div>
      </div>
    </div>
  )
}
