export default function SectionHeading({ children, sub }){
  return (
    <div>
      <h3 className="text-2xl font-semibold">{children}</h3>
      {sub && <p className="text-sm text-slate-600 mt-2">{sub}</p>}
    </div>
  )
}
