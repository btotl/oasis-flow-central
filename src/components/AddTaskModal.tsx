
import { useState } from 'react';

interface AddTaskModalProps {
  onClose: () => void;
  onAddTask: (task: { title: string; description: string; imageUrl?: string }) => void;
}

export const AddTaskModal = ({ onClose, onAddTask }: AddTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      let imageUrl = '';
      if (imageFile) {
        // In a real app, you'd upload to your server/storage
        // For demo, we'll use a placeholder
        imageUrl = URL.createObjectURL(imageFile);
      }
      
      onAddTask({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl || undefined
      });
      
      onClose();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Add New Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-2">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="neo-input w-full"
              required
            />
          </div>
          
          <div>
            <label className="block font-bold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="neo-input w-full h-24 resize-none"
              required
            />
          </div>
          
          <div>
            <label className="block font-bold mb-2">Task Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="neo-input w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="neo-button-primary flex-1"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="neo-button flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
