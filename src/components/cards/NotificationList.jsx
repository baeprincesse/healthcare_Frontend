const getNotificationIcon = (type) => {
  switch (type) {
    case 'appointment':
      return '📅'
    case 'payment':
      return '✅'
    case 'message':
      return '💬'
    case 'reminder':
      return '⏰'
    default:
      return '📬'
  }
}

export default function NotificationList({ notifications = [] }) {
  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-green-50 p-6 text-center">
        <p className="text-gray-500">No recent notifications</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-green-50">
      <div className="px-6 py-4 border-b border-green-50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Notifications</h2>
          <a href="#" className="text-green-600 text-sm font-medium hover:text-green-700">View all</a>
        </div>
      </div>

      <div className="divide-y divide-green-50">
        {notifications.map((notif, idx) => (
          <div key={idx} className="px-6 py-4 hover:bg-green-50 transition-colors">
            <div className="flex gap-4">
              <span className="text-2xl flex-shrink-0">{getNotificationIcon(notif.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{notif.message}</p>
                <p className="text-gray-600 text-xs mt-1">{notif.details}</p>
                <p className="text-gray-400 text-xs mt-2">{notif.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
