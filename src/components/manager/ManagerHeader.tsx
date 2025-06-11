
import { Clock, Settings, Archive } from 'lucide-react';
import { NotificationSystem } from '../NotificationSystem';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ManagerHeaderProps {
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onDismissNotification: (id: string) => void;
  onOpenModal: (modalType: string) => void;
}

export const ManagerHeader = ({
  notifications,
  onMarkNotificationAsRead,
  onDismissNotification,
  onOpenModal
}: ManagerHeaderProps) => {
  return (
    <div className="neo-card p-4 sm:p-6 bg-gradient-to-r from-neo-purple/30 to-neo-pink/30 rounded-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Manager Dashboard</h2>
        <div className="flex gap-3">
          <NotificationSystem 
            notifications={notifications}
            onMarkAsRead={onMarkNotificationAsRead}
            onDismiss={onDismissNotification}
          />
          <button
            onClick={() => onOpenModal('timeLogs')}
            className="neo-button bg-blue-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2"
          >
            <Clock size={16} />
            Time Logs
          </button>
          <button
            onClick={() => onOpenModal('layout')}
            className="neo-button bg-purple-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2"
          >
            <Settings size={16} />
            Layout
          </button>
          <button
            onClick={() => onOpenModal('archive')}
            className="neo-button bg-orange-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2"
          >
            <Archive size={16} />
            Archive
          </button>
        </div>
      </div>
    </div>
  );
};
