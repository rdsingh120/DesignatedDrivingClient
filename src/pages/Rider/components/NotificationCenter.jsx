import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../../features/notifications/notificationsSlice";
import {
  colors, alpha, gradients,
  iconBtn, dropdown, countBadge, pill, textBtn, emptyState, listRow,
} from "../../../styles/theme";

const POLL_INTERVAL_MS = 15000;

const TYPE_META = {
  TRIP_ACCEPTED:  { icon: "🚗", color: colors.warningLight },
  DRIVER_ARRIVED: { icon: "📍", color: colors.primaryLight },
  TRIP_COMPLETED: { icon: "✅", color: colors.successLight },
  TRIP_CANCELLED: { icon: "❌", color: colors.dangerLight },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationCenter() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const notifications = useAppSelector((s) => s.notifications.notifications);
  const unreadCount   = useAppSelector((s) => s.notifications.unreadCount);

  // Inject pulse keyframes once
  useEffect(() => {
    const id = "notif-pulse-style";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = `
        @keyframes notif-pulse {
          0%   { transform: scale(1); opacity: 0.6; }
          70%  { transform: scale(2); opacity: 0; }
          100% { transform: scale(2); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Initial fetch + periodic polling
  useEffect(() => {
    dispatch(fetchNotifications());
    const id = setInterval(() => dispatch(fetchNotifications()), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [dispatch]);

  // Close panel on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleNotificationClick(notification) {
    if (!notification.read) dispatch(markNotificationAsRead(notification._id));
    setOpen(false);
    navigate(`/rider/trip/${notification.trip}`);
  }

  function handleMarkAllRead(e) {
    e.stopPropagation();
    dispatch(markAllNotificationsAsRead());
  }

  const hasUnread = unreadCount > 0;

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      {/* Pulse ring */}
      {hasUnread && !open && (
        <span style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: colors.primary, animation: "notif-pulse 2s ease-out infinite",
          pointerEvents: "none",
        }} />
      )}

      {/* Bell button — iconBtn base + notification-specific overrides */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        style={{
          ...iconBtn,
          background: gradients.primary,
          color: "#fff",
          boxShadow: open ? `0 6px 24px ${alpha.primary50}` : `0 4px 16px ${alpha.primary40}`,
        }}
      >
        <Bell size={18} strokeWidth={2} />

        {/* Unread count badge */}
        {hasUnread && (
          <span style={{ ...countBadge, boxShadow: `0 0 0 2px ${colors.bgDeep}` }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel — dropdown base + notification-specific size */}
      {open && (
        <div style={{ ...dropdown, top: "calc(100% + 12px)", right: 0, width: 340, maxHeight: 480 }}>

          {/* Panel header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px 10px", borderBottom: `1px solid ${colors.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Bell size={16} color={colors.primaryLight} />
              <span style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary }}>
                Notifications
              </span>
              {/* Unread pill — pill base, already styled */}
              {hasUnread && <span style={pill}>{unreadCount} new</span>}
            </div>
            {/* Text action — textBtn base + color override */}
            {hasUnread && (
              <button onClick={handleMarkAllRead} style={{ ...textBtn, color: colors.primaryLight }}>
                Mark all as read
              </button>
            )}
          </div>

          {/* Empty state */}
          {notifications.length === 0 ? (
            <div style={emptyState}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div>
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => {
              const meta = TYPE_META[n.type] || { icon: "🔔", color: colors.textSecondary };
              return (
                /* List row — listRow base + dynamic read background */
                <button
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  style={{ ...listRow, background: n.read ? "transparent" : alpha.primary10 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = n.read ? alpha.neutral15 : alpha.primary15; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = n.read ? "transparent" : alpha.primary10; }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: alpha.primary12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>
                    {meta.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700, color: meta.color,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {n.title}
                      </span>
                      <span style={{ fontSize: 11, color: colors.textFaint, flexShrink: 0 }}>
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: colors.textSecondary, lineHeight: 1.4 }}>
                      {n.message}
                    </p>
                  </div>

                  {!n.read && (
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: colors.primary, flexShrink: 0, marginTop: 4,
                    }} />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
