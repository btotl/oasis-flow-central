
import { useState } from 'react';
import { TaskList } from './TaskList';
import { GiftVoucherModal } from './GiftVoucherModal';
import { LaybyModal } from './LaybyModal';
import { CustomerRequestModal } from './CustomerRequestModal';
import { AddTaskModal } from './AddTaskModal';
import { MessageManagementModal } from './MessageManagementModal';
import { ImportantMessage } from './ImportantMessage';

interface ManagerDashboardProps {
  importantMessages: ImportantMessage[];
  setImportantMessages: React.Dispatch<React.SetStateAction<ImportantMessage[]>>;
}

export const ManagerDashboard = ({ importantMessages, setImportantMessages }: ManagerDashboardProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [employeeNotes] = useState([
    {
      id: '1',
      content: 'Customer asked about rare orchid varieties - might need special order',
      timestamp: new Date(2024, 5, 9, 14, 30),
      author: 'Sarah'
    }
  ]);

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleAddTask = (task: { title: string; description: string; imageUrl?: string }) => {
    console.log('Adding task:', task);
    // In a real app, this would update the task list state
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Manager Overview */}
      <div className="neo-card p-4 sm:p-6 bg-neo-purple/20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Manager Dashboard</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="neo-card p-3 sm:p-4 bg-neo-yellow text-center">
            <h3 className="text-xl sm:text-2xl font-bold">12</h3>
            <p className="text-gray-800 font-medium text-sm sm:text-base">Active Tasks</p>
          </div>
          <div className="neo-card p-3 sm:p-4 bg-neo-pink text-center">
            <h3 className="text-xl sm:text-2xl font-bold">$1,250</h3>
            <p className="text-gray-800 font-medium text-sm sm:text-base">Gift Vouchers</p>
          </div>
          <div className="neo-card p-3 sm:p-4 bg-neo-blue text-center">
            <h3 className="text-xl sm:text-2xl font-bold">7</h3>
            <p className="text-gray-800 font-medium text-sm sm:text-base">Active Laybys</p>
          </div>
          <div className="neo-card p-3 sm:p-4 bg-neo-green text-center">
            <h3 className="text-xl sm:text-2xl font-bold">15</h3>
            <p className="text-gray-800 font-medium text-sm sm:text-base">Pending Requests</p>
          </div>
        </div>
      </div>

      {/* Management Actions */}
      <div className="neo-card p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Management Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          <button
            onClick={() => openModal('voucher')}
            className="neo-button bg-neo-pink text-white h-12 sm:h-16 text-sm sm:text-base"
          >
            Manage Gift Vouchers
          </button>
          <button
            onClick={() => openModal('layby')}
            className="neo-button bg-neo-blue text-white h-12 sm:h-16 text-sm sm:text-base"
          >
            Manage Laybys
          </button>
          <button
            onClick={() => openModal('request')}
            className="neo-button bg-neo-green text-white h-12 sm:h-16 text-sm sm:text-base"
          >
            Manage Customer Requests
          </button>
          <button
            onClick={() => openModal('addTask')}
            className="neo-button-primary h-12 sm:h-16 text-sm sm:text-base"
          >
            Add Task
          </button>
          <button
            onClick={() => openModal('messages')}
            className="neo-button bg-neo-orange text-white h-12 sm:h-16 text-sm sm:text-base"
          >
            Important Messages
          </button>
        </div>
      </div>

      {/* Tasks and Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <TaskList />
        
        {/* Employee Notes (Read-only for manager) */}
        <div className="neo-card p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Employee Notes</h2>
          
          <div className="space-y-3 max-h-80 overflow-y-auto neo-scrollbar">
            {employeeNotes.map((note) => (
              <div key={note.id} className="bg-neo-yellow/30 border-4 border-black p-4">
                <p className="text-gray-900 font-medium text-sm sm:text-base break-words">{note.content}</p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 text-xs sm:text-sm text-gray-600">
                  <span>By: {note.author}</span>
                  <span className="mt-1 sm:mt-0">{note.timestamp.toLocaleDateString()} at {note.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'voucher' && <GiftVoucherModal onClose={closeModal} />}
      {activeModal === 'layby' && <LaybyModal onClose={closeModal} />}
      {activeModal === 'request' && <CustomerRequestModal onClose={closeModal} />}
      {activeModal === 'addTask' && (
        <AddTaskModal 
          onClose={closeModal} 
          onAddTask={handleAddTask}
        />
      )}
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
