import { useState, useRef, useEffect } from "react";
import { Bell, AlertTriangle } from "lucide-react";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "../../hooks/notifications/useNotifications";

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} د`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} س`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const { data } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative rounded-lg p-2 text-text-secondary hover:bg-bg-raised"
        aria-label="التنبيهات"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -left-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-semibold">أحدث التنبيهات</p>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-accent hover:underline"
              >
                تعليم الكل كمقروء
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {!notifications.length && (
              <p className="px-4 py-8 text-center text-sm text-text-secondary">
                لا توجد تنبيهات حاليًا
              </p>
            )}

            {notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => !n.isLive && !n.isRead && markAsRead(n._id)}
                className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 text-right last:border-0 hover:bg-bg-raised ${
                  n.isRead ? "opacity-60" : ""
                }`}
              >
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">{n.message}</p>
                  <p className="mt-1 text-xs text-text-muted">{timeAgo(n.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}