export default function AppointmentCardLarge({ appointment }) {
  if (!appointment) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-green-50 p-8 text-center">
        <p className="text-gray-500">No upcoming appointments</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-green-50 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Appointment</h2>

      <div className="flex gap-6">
        {/* Doctor Avatar */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl">
            {appointment.avatar || '👨‍⚕️'}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="flex-1">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">{appointment.doctor}</h3>
            <p className="text-sm text-gray-600">{appointment.specialty}</p>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Hospital:</span> {appointment.location}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">📅 {appointment.date}</span> • <span className="font-medium">🕒 {appointment.time}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-green-50">
            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
              ✓ {appointment.status}
            </span>
            <button className="text-green-600 text-sm font-medium hover:text-green-700">
              View details →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
