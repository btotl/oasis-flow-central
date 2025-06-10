
import { useState } from 'react';
import { TaskList } from './TaskList';
import { GiftVoucherModal } from './GiftVoucherModal';
import { LaybyModal } from './LaybyModal';
import { CustomerRequestModal } from './CustomerRequestModal';
import { MessageManagementModal } from './MessageManagementModal';
import { ImportantMessage } from './ImportantMessage';
import { Maximize2, Trash2 } from 'lucide-react';

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
    imageUrl: ''
  });

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
      setNewTask({ title: '', description: '', imageUrl: '' });
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

  const deleteNote = (noteId: string) => {
    console.log('Deleting note:', noteId);
    // In a real app, this would update the notes state
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Manager Header */}
      <div className="neo-card p-4 sm:p-6 bg-neo-purple/20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Manager Dashboard</h2>
      </div>

      {/* Management Actions */}
      <div className="neo-card p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Management Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative">
            <button
              onClick={() => openModal('voucher')}
              className="neo-button bg-neo-pink text-white h-12 sm:h-16 text-sm sm:text-base w-full"
            >
              Gift Vouchers
            </button>
            <button
              onClick={() => console.log('Open vouchers page')}
              className="absolute top-2 right-2 p-1 bg-white rounded-lg border-2 border-black hover:bg-gray-100"
            >
              <Maximize2 size={14} />
            </button>
          </div>
          
          <div className="relative">
            <button
              onClick={() => openModal('layby')}
              className="neo-button bg-neo-blue text-white h-12 sm:h-16 text-sm sm:text-base w-full"
            >
              Laybys
            </button>
            <button
              onClick={() => console.log('Open laybys page')}
              className="absolute top-2 right-2 p-1 bg-white rounded-lg border-2 border-black hover:bg-gray-100"
            >
              <Maximize2 size={14} />
            </button>
          </div>
          
          <div className="relative">
            <button
              onClick={() => openModal('request')}
              className="neo-button bg-neo-green text-white h-12 sm:h-16 text-sm sm:text-base w-full"
            >
              Customer Requests
            </button>
            <button
              onClick={() => console.log('Open requests page')}
              className="absolute top-2 right-2 p-1 bg-white rounded-lg border-2 border-black hover:bg-gray-100"
            >
              <Maximize2 size={14} />
            </button>
          </div>
          
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
          <div className="neo-card p-4 sm:p-6 bg-neo-yellow/20">
            <h3 className="text-lg font-bold mb-3 text-gray-900">Add New Task</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="neo-input w-full"
              />
              <input
                type="text"
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="neo-input w-full"
              />
              <input
                type="url"
                placeholder="Image URL (optional)"
                value={newTask.imageUrl}
                onChange={(e) => setNewTask({ ...newTask, imageUrl: e.target.value })}
                className="neo-input w-full"
              />
              <button
                onClick={handleAddTask}
                className="neo-button-primary w-full"
              >
                Add Task
              </button>
            </div>
          </div>
          
          <TaskList />
        </div>
        
        {/* Employee Notes (Read-only for manager) */}
        <div className="neo-card p-4 sm:p-6">
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
                  onClick={() => deleteNote(note.id)}
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
