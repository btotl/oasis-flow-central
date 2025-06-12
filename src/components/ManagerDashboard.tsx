
import { useState } from 'react';
import { TaskList } from './TaskList';
import { GiftVoucherModal } from './GiftVoucherModal';
import { LaybyModal } from './LaybyModal';
import { CustomerRequestModal } from './CustomerRequestModal';
import { MessageManagementModal } from './MessageManagementModal';
import { ImportantMessage } from './ImportantMessage';
import { TimeLogsModal } from './TimeLogsModal';
import { LayoutEditor } from './LayoutEditor';
import { ArchiveManager } from './ArchiveManager';
import { CustomerCreditModal } from './CustomerCreditModal';
import { LatestCustomerRequests } from './LatestCustomerRequests';
import { ManagerHeader } from './manager/ManagerHeader';
import { ManagementTools } from './manager/ManagementTools';
import { AddTaskForm } from './manager/AddTaskForm';
import { EmployeeNotesManager } from './manager/EmployeeNotesManager';
import { ManagerNotes } from './manager/ManagerNotes';
import { Consignments } from './manager/Consignments';
import { ReceiptMaker } from './manager/ReceiptMaker';
import { PlantLookup } from './manager/PlantLookup';

interface ManagerDashboardProps {
  importantMessages: ImportantMessage[];
  setImportantMessages: React.Dispatch<React.SetStateAction<ImportantMessage[]>>;
}

export const ManagerDashboard = ({ importantMessages, setImportantMessages }: ManagerDashboardProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'info' as const,
      title: 'New Customer Request',
      message: 'Emma Wilson requested a Bird of Paradise plant',
      timestamp: new Date(),
      read: false
    }
  ]);

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleAddMessage = (message: { title: string; content: string }) => {
    const newMessage: ImportantMessage = {
      id: Date.now().toString(),
      title: message.title,
      content: message.content,
      createdAt: new Date(),
      acknowledgedBy: []
    };
    setImportantMessages(prev => [...prev, newMessage]);
  };

  const handleDeleteMessage = (messageId: string) => {
    setImportantMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Manager Header */}
      <ManagerHeader
        notifications={notifications}
        onMarkNotificationAsRead={markNotificationAsRead}
        onDismissNotification={dismissNotification}
        onOpenModal={openModal}
      />

      {/* Latest Customer Requests Widget */}
      <LatestCustomerRequests />

      {/* Management Actions */}
      <ManagementTools onOpenModal={openModal} />

      {/* New Features Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <ManagerNotes />
        <Consignments />
      </div>

      {/* New Features Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <ReceiptMaker />
        <PlantLookup />
      </div>

      {/* Tasks and Employee Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4">
          <AddTaskForm />
          <TaskList isManagerView={true} />
        </div>
        
        <EmployeeNotesManager />
      </div>

      {/* Modals */}
      {activeModal === 'voucher' && <GiftVoucherModal onClose={closeModal} />}
      {activeModal === 'layby' && <LaybyModal onClose={closeModal} />}
      {activeModal === 'request' && <CustomerRequestModal onClose={closeModal} />}
      {activeModal === 'credit' && <CustomerCreditModal onClose={closeModal} />}
      {activeModal === 'timeLogs' && <TimeLogsModal onClose={closeModal} />}
      {activeModal === 'layout' && <LayoutEditor onClose={closeModal} />}
      {activeModal === 'archive' && <ArchiveManager onClose={closeModal} />}
      {activeModal === 'messages' && (
        <MessageManagementModal
          messages={importantMessages}
          onClose={closeModal}
          onAddMessage={handleAddMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      )}
    </div>
  );
};
