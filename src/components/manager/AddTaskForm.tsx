
import { useState } from 'react';
import { Upload } from 'lucide-react';

interface NewTask {
  title: string;
  description: string;
  imageFile: File | null;
}

export const AddTaskForm = () => {
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    imageFile: null
  });

  const handleAddTask = () => {
    if (newTask.title && newTask.description) {
      console.log('Adding task:', newTask);
      // In a real app, this would update the task list state
      setNewTask({ title: '', description: '', imageFile: null });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTask({ ...newTask, imageFile: e.target.files[0] });
    }
  };

  return (
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
              onChange={handleImageUpload}
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
          onClick={handleAddTask}
          className="neo-button-primary w-full"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};
