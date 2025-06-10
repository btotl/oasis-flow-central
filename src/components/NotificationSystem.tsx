
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const NotificationSystem = ({ notifications, onMarkAsRead, onDismiss }: NotificationSystemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative neo-button bg-neo-blue text-white"
      >
        Notifications
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="neo-card p-6 max-w-2xl max-h-[80vh] overflow-y-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Notifications</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="neo-button-danger"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-4 border-black rounded-xl ${
                      notification.read ? 'bg-gray-100' : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold text-white px-2 py-1 rounded-lg ${getNotificationColor(notification.type)}`}>
                        {notification.type.toUpperCase()}
                      </span>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-xs neo-button-tab px-2 py-1"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => onDismiss(notification.id)}
                          className="text-xs neo-button-danger px-2 py-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {notification.timestamp.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
