import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImportantMessage } from '@/types/ImportantMessage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MessageManagementModalProps {
  onClose: () => void;
  importantMessages: ImportantMessage[];
  setImportantMessages: (messages: ImportantMessage[]) => void;
}

export const MessageManagementModal = ({ 
  onClose, 
  importantMessages, 
  setImportantMessages 
}: MessageManagementModalProps) => {
  const { user, profile } = useAuth();
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddMessage = async () => {
    if (!newTitle.trim() || !newContent.trim() || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('important_messages')
        .insert({
          title: newTitle,
          content: newContent,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage: ImportantMessage = {
        id: data.id,
        title: data.title,
        content: data.content,
        createdBy: data.created_by,
        createdAt: new Date(data.created_at),
        acknowledgedBy: []
      };

      setImportantMessages([newMessage, ...importantMessages]);
      setNewTitle('');
      setNewContent('');
    } catch (error) {
      console.error('Error adding message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('important_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setImportantMessages(importantMessages.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 max-w-2xl w-full rounded-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manage Important Messages</h2>
          <button
            onClick={onClose}
            className="neo-button text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Add New Message Form */}
        <div className="bg-gray-50 border-2 border-black p-4 rounded-xl mb-6">
          <h3 className="text-lg font-bold mb-4">Add New Message</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Message title"
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Message content"
                className="w-full h-24 p-3 border-2 border-black rounded-lg resize-none"
              />
            </div>
            <Button
              onClick={handleAddMessage}
              disabled={loading || !newTitle.trim() || !newContent.trim()}
              className="neo-button-primary w-full"
            >
              <Plus size={16} className="mr-2" />
              Add Message
            </Button>
          </div>
        </div>

        {/* Existing Messages */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Existing Messages</h3>
          {importantMessages.map((message) => (
            <div key={message.id} className="bg-white border-2 border-black p-4 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg">{message.title}</h4>
                <Button
                  onClick={() => handleDeleteMessage(message.id)}
                  className="neo-button bg-red-500 text-white text-sm p-2"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <p className="text-gray-700 mb-2">{message.content}</p>
              <p className="text-sm text-gray-500">
                Created: {message.createdAt.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Acknowledged by: {message.acknowledgedBy.length} employees
              </p>
            </div>
          ))}
          {importantMessages.length === 0 && (
            <p className="text-gray-500 text-center py-8">No messages yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
