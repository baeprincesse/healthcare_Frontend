const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function AppointmentHistoryTable({ appointments = [] }) {
  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-green-50 p-6 text-center">
        <p className="text-gray-500">No appointment history</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-green-50 overflow-hidden">
      <div className="px-6 py-4 border-b border-green-50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Appointment History</h2>
          <a href="#" className="text-green-600 text-sm font-medium hover:text-green-700">View all</a>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-green-50 bg-green-50">
              <th className="text-left py-3 px-6 font-semibold text-gray-900">Doctor</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">Date</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">Department</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">Status</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt, idx) => (
              <tr key={idx} className="border-b border-green-50 hover:bg-green-50 transition-colors">
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{apt.avatar || '👨‍⚕️'}</span>
                    <span className="font-medium text-gray-900">{apt.doctor}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-gray-700">{apt.date}</td>
                <td className="py-3 px-6 text-gray-700">{apt.department}</td>
                <td className="py-3 px-6">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <a href="#" className="text-green-600 text-sm hover:text-green-700 font-medium">View</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
