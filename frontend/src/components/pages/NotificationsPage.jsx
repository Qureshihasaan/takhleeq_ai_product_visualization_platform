import React, { useState, useEffect } from "react";
import { Bell, Sparkles, AlertCircle, ShoppingBag, Check, RefreshCw } from "lucide-react";
import { notificationService } from "../../services/notificationService";

// Icon and color mapping for notification types
const TYPE_CONFIG = {
  system: { icon: Sparkles, color: "text-primaryColor", bg: "bg-primaryColor/10" },
  order: { icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
  alert: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  default: { icon: Bell, color: "text-textColorMuted", bg: "bg-surfaceColor" },
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Could not load notifications.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="min-h-screen bg-backgroundColor p-paddingLarge">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-marginLarge border-b border-borderColor pb-paddingMedium">
          <div>
            <h1 className="text-3xl font-fontWeightBold text-textColorMain flex items-center gap-2">
              <Bell className="text-primaryColor" size={32} />
              Notifications
            </h1>
            <p className="text-textColorMuted mt-1">
              Stay updated with the latest alerts and activities.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchNotifications}
              disabled={loading}
              className="text-fontSizeSm text-textColorMuted hover:text-primaryColor transition-colors flex items-center gap-1"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            {notifications.some((n) => n.unread) && (
              <button
                onClick={handleMarkAllRead}
                className="text-fontSizeSm text-primaryColor font-fontWeightMedium hover:underline flex items-center gap-1"
              >
                <Check size={16} /> Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 p-paddingLarge rounded-borderRadiusLg border border-borderColor bg-surfaceColor animate-pulse"
              >
                <div className="shrink-0 w-12 h-12 rounded-full bg-borderColor" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-borderColor rounded w-1/3" />
                  <div className="h-3 bg-borderColor rounded w-2/3" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="text-center py-16 text-errorColor">
              <AlertCircle size={48} className="mx-auto mb-4 opacity-60" />
              <p className="text-lg">{error}</p>
              <button
                onClick={fetchNotifications}
                className="mt-4 text-primaryColor hover:underline text-fontSizeSm"
              >
                Retry
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20 text-textColorMuted">
              <Bell size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">You're all caught up!</p>
              <p className="text-fontSizeSm mt-1">No notifications at the moment.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const config =
                TYPE_CONFIG[notif.type] || TYPE_CONFIG.default;
              const Icon = config.icon;
              return (
                <div
                  key={notif.id}
                  className={`flex gap-4 p-paddingLarge rounded-borderRadiusLg border transition-all duration-300 hover:shadow-md
                    ${
                      notif.unread
                        ? "bg-surfaceColor border-primaryColor/30 shadow-primaryColor/5"
                        : "bg-backgroundColor border-borderColor"
                    }`}
                >
                  <div
                    className={`mt-1 shrink-0 w-12 h-12 rounded-borderRadiusFull flex items-center justify-center ${config.bg}`}
                  >
                    <Icon className={config.color} size={24} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                      <h3
                        className={`text-fontSizeLg font-fontWeightBold ${
                          notif.unread ? "text-textColorMain" : "text-textColorMuted"
                        }`}
                      >
                        {notif.title}
                      </h3>
                      <span className="text-fontSizeXs font-fontWeightMedium text-textColorMuted">
                        {notif.time ||
                          (notif.created_at
                            ? new Date(notif.created_at).toLocaleDateString()
                            : "")}
                      </span>
                    </div>
                    <p className="text-textColorMuted text-fontSizeSm leading-relaxed">
                      {notif.desc || notif.description || notif.message || ""}
                    </p>
                  </div>

                  {notif.unread && (
                    <div className="shrink-0 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-primaryColor shadow-[0_0_8px_rgba(var(--primaryColorRgb),0.6)]" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
