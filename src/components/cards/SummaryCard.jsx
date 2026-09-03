export default function SummaryCard({ icon, title, value, subtitle, action, actionLink }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-green-50 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
          {action && (
            <a href={actionLink || '#'} className="inline-block text-green-600 text-sm font-medium mt-3 hover:text-green-700">
              {action} →
            </a>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )
}
