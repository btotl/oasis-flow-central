
import { useState, useEffect } from 'react';

export interface ImportantMessage {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  acknowledgedBy: Array<{
    employeeName: string;
    acknowledgedAt: Date;
  }>;
}

interface ImportantMessageModalProps {
  message: ImportantMessage;
  onAcknowledge: (messageId: string, employeeName: string) => void;
  onRemindLater: (messageId: string) => void;
}

export const ImportantMessageModal = ({ message, onAcknowledge, onRemindLater }: ImportantMessageModalProps) => {
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    // Get employee name from localStorage or set a default
    const savedName = localStorage.getItem('employeeName') || 'Employee';
    setEmployeeName(savedName);
  }, []);

  const handleAcknowledge = () => {
    // Save to localStorage to prevent showing again
    const acknowledgedMessages = JSON.parse(localStorage.getItem('acknowledgedMessages') || '[]');
    acknowledgedMessages.push(message.id);
    localStorage.setItem('acknowledgedMessages', JSON.stringify(acknowledgedMessages));
    
    onAcknowledge(message.id, employeeName);
  };

  const handleRemindLater = () => {
    onRemindLater(message.id);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 w-full max-w-lg rounded-3xl">
        <div className="bg-red-100 border-4 border-red-500 p-4 mb-4 rounded-2xl">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Important Notice</h2>
          <h3 className="text-xl font-bold mb-2">{message.title}</h3>
          <p className="text-gray-800">{message.content}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAcknowledge}
            className="neo-button-primary flex-1"
          >
            I Understand
          </button>
          <button
            onClick={handleRemindLater}
            className="neo-button flex-1"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
};
