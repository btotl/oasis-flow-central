
import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export interface ImportantMessage {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  acknowledgedBy: string[];
}

export interface MessageManagementModalProps {
  onClose: () => void;
  importantMessages?: ImportantMessage[];
  setImportantMessages?: (messages: ImportantMessage[]) => void;
}

export const MessageManagementModal = ({ 
  onClose, 
  importantMessages = [], 
  setImportantMessages 
}: MessageManagementModalProps) => {
  const [newMessage, setNewMessage] = useState({ title: '', message: '' });

  const addMessage = () => {
    if (newMessage.title && newMessage.message && setImportantMessages) {
      const message: ImportantMessage = {
        id: Date.now().toString(),
        title: newMessage.title,
        message: newMessage.message,
        timestamp: new Date(),
        acknowledgedBy: []
      };
      setImportantMessages([...importantMessages, message]);
      setNewMessage({ title: '', message: '' });
    }
  };

  const deleteMessage = (id: string) => {
    if (setImportantMessages) {
      setImportantMessages(importantMessages.filter(msg => msg.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Important Messages</h2>
          <Button onClick={onClose} className="neo-button bg-gray-500 text-white">
            <X size={20} />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded-xl">
            <h3 className="font-bold mb-4">Add New Message</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="message-title">Title</Label>
                <Input
                  id="message-title"
                  value={newMessage.title}
                  onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
                  placeholder="Enter message title"
                />
              </div>
              <div>
                <Label htmlFor="message-content">Message</Label>
                <Textarea
                  id="message-content"
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                  placeholder="Enter message content"
                  rows={4}
                />
              </div>
              <Button onClick={addMessage} className="neo-button bg-neo-green text-white">
                <Plus size={16} className="mr-2" />
                Add Message
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Current Messages ({importantMessages.length})</h3>
            {importantMessages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No important messages</p>
            ) : (
              <div className="space-y-3">
                {importantMessages.map((msg) => (
                  <div key={msg.id} className="bg-white border-2 border-gray-300 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold">{msg.title}</h4>
                      <Button 
                        onClick={() => deleteMessage(msg.id)}
                        className="neo-button bg-red-500 text-white p-2"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <p className="text-gray-700 mb-2">{msg.message}</p>
                    <div className="text-sm text-gray-500">
                      <p>Created: {msg.timestamp.toLocaleString()}</p>
                      <p>Acknowledged by: {msg.acknowledgedBy.length} people</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
