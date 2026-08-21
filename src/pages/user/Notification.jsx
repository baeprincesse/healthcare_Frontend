import {
  Bell,
  CalendarDays,
  CheckCircle2,
  FileText,
  Pill,
  CreditCard,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "appointment",
      title: "Appointment confirmed",
      message:
        "Your appointment with Dr. Sarah Johnson has been confirmed.",
      time: "10 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "prescription",
      title: "New prescription available",
      message:
        "Dr. Michael Brown has added a new prescription to your medical record.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 3,
      type: "payment",
      title: "Payment successful",
      message:
        "Your payment of 15,000 FCFA has been successfully processed.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 4,
      type: "record",
      title: "Medical record updated",
      message:
        "Your medical record has been updated following your recent consultation.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 5,
      type: "reminder",
      title: "Appointment reminder",
      message:
        "You have an appointment tomorrow at 10:30 AM.",
      time: "2 days ago",
      unread: false,
    },
  ]);

  const getIcon = (type) => {
    switch (type) {
      case "appointment":
        return <CalendarDays size={19} />;

      case "prescription":
        return <Pill size={19} />;

      case "payment":
        return <CreditCard size={19} />;

      case "record":
        return <FileText size={19} />;

      default:
        return <Bell size={19} />;
    }
  };

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                {unreadCount} new
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Stay updated with your healthcare activities.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
        >
          <CheckCircle2 size={15} />
          Mark all as read
        </button>

      </div>

      {/* Notification container */}
      <div className="rounded-xl bg-white shadow-sm">

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">

            <div className="mb-4 rounded-full bg-emerald-50 p-4 text-emerald-600">
              <Bell size={25} />
            </div>

            <h2 className="font-semibold text-slate-900">
              No notifications
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              You're all caught up!
            </p>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group flex gap-4 p-5 transition hover:bg-slate-50 ${
                  notification.unread
                    ? "bg-emerald-50/30"
                    : "bg-white"
                }`}
              >

                {/* Icon */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    notification.unread
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">

                  <div className="flex flex-col justify-between gap-1 sm:flex-row">

                    <div className="flex items-center gap-2">

                      <h3 className="text-sm font-semibold text-slate-900">
                        {notification.title}
                      </h3>

                      {notification.unread && (
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      )}

                    </div>

                    <span className="text-[11px] text-slate-400">
                      {notification.time}
                    </span>

                  </div>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                    {notification.message}
                  </p>

                </div>

                {/* Delete */}
                <button
                  onClick={() =>
                    removeNotification(notification.id)
                  }
                  className="self-center rounded-lg p-2 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  title="Delete notification"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}