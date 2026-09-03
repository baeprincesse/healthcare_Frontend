export default function QuickActionButton({ icon, label, onClick, link }) {
  const Component = link ? 'a' : 'button'
  const props = link ? { href: link } : { onClick, type: 'button' }

  return (
    <Component
      {...props}
      className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-green-50 hover:border-green-200 hover:bg-green-50 transition-colors group"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">{label}</span>
      <span className="ml-auto text-gray-400 group-hover:text-green-600">→</span>
    </Component>
  )
}
