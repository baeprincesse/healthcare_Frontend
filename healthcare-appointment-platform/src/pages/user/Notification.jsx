import {
  Bell,
  CalendarDays,
  CheckCircle2,
  FileText,
  Pill,
  CreditCard,
  ShieldCheck,
  Trash2,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";

const BASE_PATH = "/fronted/healthcare-appointment-platform";

export default function Notifications() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } = useSocket();
  const [serverNotifications, setServerNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const accessRequestsPath =
    user?.role === "DOCTOR" && localStorage.getItem("activeMode") !== "patient"
      ? `${BASE_PATH}/doctor/record-access`
      : `${BASE_PATH}/medical-record-access`;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        setServerNotifications(response.data?.data || []);
        await api.patch("/notifications/read-all");
        markAllRead();
        setServerNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [markAllRead]);

  const allNotifications = [
    ...notifications.filter((n) => n.live),
    ...serverNotifications.filter(
      (sn) => !notifications.find((n) => !n.live && n.id === sn.id)
    ),
  ];

  const getIcon = (type) => {
    switch (type) {
      case "consultation_started":
        return <Video size={19} />;
      case "appointment_confirmed":
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

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      markAllRead();
      setServerNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch {
      // ignore
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      markAsRead(id);
      setServerNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // ignore
    }
  };

  const displayUnread = unreadCount;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Notifications
            </h1>
            {displayUnread > 0 && (
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                {displayUnread} new
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Stay updated with your healthcare activities.
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
        >
          <CheckCircle2 size={15} />
          Mark all as read
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-emerald-50 p-4 text-emerald-600">
              <Bell size={25} />
            </div>
            <p className="text-xs text-slate-500">Loading notifications...</p>
          </div>
        ) : allNotifications.length === 0 ? (
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
            {allNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group flex gap-4 p-5 transition hover:bg-slate-50 ${
                  !notification.isRead
                    ? "bg-emerald-50/30"
                    : "bg-white"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    !notification.isRead
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {getIcon(notification.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleString()
                        : ""}
                    </span>
                  </div>
                  <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                    {notification.message}
                  </p>
                  {notification.type === "consultation_started" &&
                    notification.appointmentId &&
                    !notification.isRead && (
                      <button
                        onClick={() =>
                          (window.location.href = `/fronted/healthcare-appointment-platform/video-consultation/${notification.appointmentId}`)
                        }
                        className="mt-2 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        <Video size={13} /> Join Video Consultation
                      </button>
                    )}
                  {notification.type === "record" && (
                    <button
                      onClick={() => (window.location.href = accessRequestsPath)}
                      className="mt-2 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      <ShieldCheck size={13} /> Review Access Requests
                    </button>
                  )}
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkRead(notification.id)}
                    className="self-center rounded-lg p-2 text-slate-300 opacity-0 transition hover:bg-emerald-50 hover:text-emerald-500 group-hover:opacity-100"
                    title="Mark as read"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
