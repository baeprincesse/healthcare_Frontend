import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io as socketIO } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, authenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [liveNotification, setLiveNotification] = useState(null);

  useEffect(() => {
    if (!authenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = socketIO("http://localhost:3000", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      // socket connected
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    newSocket.on("notifications:initial", (initialNotifications) => {
      setNotifications(initialNotifications);
      setUnreadCount(initialNotifications.length);
    });

    newSocket.on("consultation:started", (data) => {
      setLiveNotification(data);
      setNotifications((prev) => [
        {
          id: `live_${Date.now()}`,
          type: "consultation_started",
          title: "Consultation Started",
          message: data.message,
          appointmentId: data.appointmentId,
          isRead: false,
          createdAt: new Date().toISOString(),
          live: true,
        },
        ...prev,
      ]);
      setUnreadCount((c) => c + 1);
    });

    newSocket.on("medical_record:created", (data) => {
      setLiveNotification(data);
      setNotifications((prev) => [
        {
          id: `live_record_${Date.now()}`,
          type: "medical_record_created",
          title: "New Medical Record",
          message: data.message,
          appointmentId: data.appointmentId,
          isRead: false,
          createdAt: new Date().toISOString(),
          live: true,
        },
        ...prev,
      ]);
      setUnreadCount((c) => c + 1);
    });

    newSocket.on("disconnect", () => {
      // socket disconnected
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [authenticated, user?.id]);

  const clearLiveNotification = useCallback(() => {
    setLiveNotification(null);
  }, []);

  const addNotifications = useCallback((items) => {
    setNotifications((prev) => [...items, ...prev]);
    setUnreadCount((c) => c + items.filter((n) => !n.isRead).length);
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  const value = {
    socket,
    notifications,
    unreadCount,
    liveNotification,
    clearLiveNotification,
    addNotifications,
    markAsRead,
    markAllRead,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }
  return context;
}

export default SocketContext;
