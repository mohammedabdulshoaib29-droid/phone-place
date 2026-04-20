import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

const notificationIcons: Record<string, string> = {
  order_placed: '📦',
  order_shipped: '🚚',
  order_delivered: '🎉',
  return_requested: '↩️',
  return_approved: '✅',
  return_rejected: '❌',
  return_refunded: '💰',
};

export default function NotificationBell() {
  const { token } = useAuth();
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications(token);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!token) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
        title="Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass-card rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 p-4 border-b border-gold/20 bg-slate-900/95">
            <h3 className="text-ivory font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-gold text-xs mt-1">{unreadCount} unread</p>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-silver text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gold/10">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    notif.isRead ? 'opacity-60' : 'bg-gold/5'
                  }`}
                  onClick={() => markAsRead(notif._id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-1">
                      {notificationIcons[notif.type] || '🔔'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ivory text-sm line-clamp-1">
                        {notif.title}
                      </p>
                      <p className="text-silver/70 text-xs mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-slate-500 text-xs mt-2">
                        {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif._id);
                      }}
                      className="text-slate-400 hover:text-red-400 text-lg leading-none"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gold/20 text-center">
              <a
                href="/notifications"
                className="text-gold text-xs font-semibold hover:text-gold/70 transition-colors"
              >
                View All Notifications →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
