
import { useState } from 'react';
import { ImportantMessage } from './ImportantMessage';

interface MessageManagementModalProps {
  messages: ImportantMessage[];
  onClose: () => void;
  onAddMessage: (message: { title: string; content: string }) => void;
  onDeleteMessage: (messageId: string) => void;
}

export const MessageManagementModal = ({ 
  messages, 
  onClose, 
  onAddMessage, 
  onDeleteMessage 
}: MessageManagementModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAddMessage({
        title: title.trim(),
        content: content.trim()
      });
      setTitle('');
      setContent('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Important Messages</h2>
          <button
            onClick={onClose}
            className="neo-button-danger"
          >
            Close
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="neo-button-primary"
          >
            {showAddForm ? 'Cancel' : 'Add New Message'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 border-4 border-black">
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Message Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="neo-input w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block font-bold mb-2">Message Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="neo-input w-full h-24 resize-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="neo-button-primary"
              >
                Create Message
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="bg-white border-4 border-black p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{message.title}</h3>
                <button
                  onClick={() => onDeleteMessage(message.id)}
                  className="neo-button-danger text-sm py-1 px-3"
                >
                  Delete
                </button>
              </div>
              
              <p className="text-gray-700 mb-4">{message.content}</p>
              
              <div className="bg-gray-50 border-2 border-gray-300 p-3">
                <h4 className="font-bold mb-2">Acknowledgments:</h4>
                {message.acknowledgedBy.length > 0 ? (
                  <div className="space-y-1">
                    {message.acknowledgedBy.map((ack, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{ack.employeeName}</span> - {ack.acknowledgedAt.toLocaleString()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No acknowledgments yet</p>
                )}
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <p className="text-gray-500 text-center py-8">No messages created yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
