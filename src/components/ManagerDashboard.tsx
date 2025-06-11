
import { useState } from 'react';
import { TaskList } from './TaskList';
import { GiftVoucherModal } from './GiftVoucherModal';
import { LaybyModal } from './LaybyModal';
import { CustomerRequestModal } from './CustomerRequestModal';
import { MessageManagementModal } from './MessageManagementModal';
import { ImportantMessage } from './ImportantMessage';
import { NotificationSystem } from './NotificationSystem';
import { TimeLogsModal } from './TimeLogsModal';
import { LayoutEditor } from './LayoutEditor';
import { ArchiveManager } from './ArchiveManager';
import { CustomerCreditModal } from './CustomerCreditModal';
import { LatestCustomerRequests } from './LatestCustomerRequests';
import { Trash2, Upload, Clock, Settings, Archive, CreditCard } from 'lucide-react';

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

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    imageFile: null as File | null
  });

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

  const handleAddTask = () => {
    if (newTask.title && newTask.description) {
      console.log('Adding task:', newTask);
      // In a real app, this would update the task list state
      setNewTask({ title: '', description: '', imageFile: null });
    }
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTask({ ...newTask, imageFile: e.target.files[0] });
    }
  };

  const deleteNote = (noteId: string) => {
    console.log('Deleting note:', noteId);
    // In a real app, this would update the notes state
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
      <div className="neo-card p-4 sm:p-6 bg-gradient-to-r from-neo-purple/30 to-neo-pink/30 rounded-3xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Manager Dashboard</h2>
          <div className="flex gap-3">
            <NotificationSystem 
              notifications={notifications}
              onMarkAsRead={(id) => setNotifications(prev => 
                prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
              )}
              onDismiss={(id) => setNotifications(prev => prev.filter(notif => notif.id !== id))}
            />
            <button
              onClick={() => openModal('timeLogs')}
              className="neo-button bg-blue-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2"
            >
              <Clock size={16} />
              Time Logs
            </button>
            <button
              onClick={() => openModal('layout')}
              className="neo-button bg-purple-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2"
            >
              <Settings size={16} />
              Layout
            </button>
            <button
              onClick={() => openModal('archive')}
              className="neo-button bg-orange-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2"
            >
              <Archive size={16} />
              Archive
            </button>
          </div>
        </div>
      </div>

      {/* Latest Customer Requests Widget */}
      <LatestCustomerRequests />

      {/* Management Actions */}
      <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-blue/20 to-neo-green/20">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Management Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <button
            onClick={() => openModal('voucher')}
            className="neo-button bg-neo-pink text-white h-12 sm:h-16 text-sm sm:text-base"
          >
            Gift Vouchers
          </button>
          
          <button
            onClick={() => openModal('layby')}
            className="neo-button bg-neo-blue text-white h-12 sm:h-16 text-sm sm:text-base"
          >
            Laybys
          </button>
          
          <button
            onClick={() => openModal('request')}
            className="neo-button bg-neo-green text-white h-12 sm:h-16 text-sm sm:text-base"
          >
            Customer Requests
          </button>
          
          <button
            onClick={() => openModal('credit')}
            className="neo-button bg-neo-yellow text-white h-12 sm:h-16 text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <CreditCard size={16} />
            Customer Credit
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
        <div className="space-y-4">
          {/* Add Task Form */}
          <div className="neo-card p-4 sm:p-6 bg-gradient-to-r from-neo-yellow/30 to-neo-orange/30 rounded-3xl">
            <h3 className="text-lg font-bold mb-3 text-gray-900">Add New Task</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="neo-input w-full"
              />
              <textarea
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="neo-input w-full h-20 resize-none"
              />
              <div>
                <label className="neo-button-tab cursor-pointer inline-flex items-center gap-2">
                  <Upload size={16} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNewTask({ ...newTask, imageFile: e.target.files[0] });
                      }
                    }}
                    className="hidden"
                  />
                </label>
                {newTask.imageFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {newTask.imageFile.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  if (newTask.title && newTask.description) {
                    console.log('Adding task:', newTask);
                    setNewTask({ title: '', description: '', imageFile: null });
                  }
                }}
                className="neo-button-primary w-full"
              >
                Add Task
              </button>
            </div>
          </div>
          
          <TaskList isManagerView={true} />
        </div>
        
        {/* Employee Notes (Read-only for manager) */}
        <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-purple/20 to-neo-blue/20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Employee Notes</h2>
          
          <div className="space-y-3 max-h-80 overflow-y-auto neo-scrollbar">
            {employeeNotes.map((note) => (
              <div key={note.id} className="bg-neo-yellow/30 border-4 border-black p-4 rounded-xl relative">
                <p className="text-gray-900 font-medium text-sm sm:text-base break-words pr-8">{note.content}</p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 text-xs sm:text-sm text-gray-600">
                  <span>By: {note.author}</span>
                  <span className="mt-1 sm:mt-0">{note.timestamp.toLocaleDateString()} at {note.timestamp.toLocaleTimeString()}</span>
                </div>
                <button
                  onClick={() => console.log('Deleting note:', note.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg border-2 border-black hover:bg-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
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
          onAddMessage={(message) => {
            const newMessage: ImportantMessage = {
              id: Date.now().toString(),
              title: message.title,
              content: message.content,
              createdAt: new Date(),
              acknowledgedBy: []
            };
            setImportantMessages(prev => [...prev, newMessage]);
          }}
          onDeleteMessage={(messageId) => {
            setImportantMessages(prev => prev.filter(msg => msg.id !== messageId));
          }}
        />
      )}
    </div>
  );
};
