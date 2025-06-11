
import { useState, useEffect } from 'react';
import { ImageModal } from './ImageModal';
import { Trash2, Upload, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  urgent: boolean;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  image_url?: string;
  before_image_url?: string;
  after_image_url?: string;
  hidden_until?: string;
  created_at: string;
  updated_at: string;
}

interface TaskListProps {
  isManagerView?: boolean;
  onDeleteTask?: (id: string) => void;
}

export const TaskList = ({ isManagerView = false, onDeleteTask }: TaskListProps) => {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('urgent', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Filter out hidden tasks for employees
      const now = new Date();
      const filteredTasks = data?.filter(task => {
        if (isManagerView) return true;
        if (!task.hidden_until) return true;
        return new Date(task.hidden_until) <= now;
      }) || [];
      
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isManagerView]);

  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task?.completed })
        .eq('id', id);
      
      if (error) throw error;
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleUrgent = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      const { error } = await supabase
        .from('tasks')
        .update({ urgent: !task?.urgent })
        .eq('id', id);
      
      if (error) throw error;
      fetchTasks();
    } catch (error) {
      console.error('Error updating task urgency:', error);
    }
  };

  const hideUntilLater = async (id: string) => {
    try {
      const hideUntil = new Date();
      hideUntil.setHours(hideUntil.getHours() + 2); // Hide for 2 hours
      
      const { error } = await supabase
        .from('tasks')
        .update({ hidden_until: hideUntil.toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      fetchTasks();
    } catch (error) {
      console.error('Error hiding task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (onDeleteTask) {
      onDeleteTask(id);
    }
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const uploadTaskImage = async (taskId: string, imageType: 'before' | 'after', file: File) => {
    try {
      // In a real app, you'd upload to Supabase Storage
      // For now, we'll use object URLs
      const imageUrl = URL.createObjectURL(file);
      const updateField = imageType === 'before' ? 'before_image_url' : 'after_image_url';
      
      const { error } = await supabase
        .from('tasks')
        .update({ [updateField]: imageUrl })
        .eq('id', taskId);
      
      if (error) throw error;
      fetchTasks();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesTab = activeTab === 'pending' ? !task.completed : task.completed;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="neo-card p-6">
        <div className="text-center">Loading tasks...</div>
      </div>
    );
  }

  const TaskItem = ({ task }: { task: Task }) => (
    <div
      className={`neo-card p-4 transition-all duration-200 ${
        task.completed ? 'bg-neo-green/20' : task.urgent ? 'bg-neo-pink/20' : 'bg-white'
      }`}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
          className="neo-checkbox mt-1 flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`text-lg sm:text-xl font-bold break-words ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.urgent && (
              <Star className="text-neo-pink flex-shrink-0" size={20} fill="currentColor" />
            )}
          </div>
          
          <p className={`text-sm sm:text-base text-gray-600 mb-2 break-words ${task.completed ? 'line-through' : ''}`}>
            {task.description}
          </p>
          
          {!task.completed && !isManagerView && (
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => toggleUrgent(task.id)}
                className={task.urgent ? 'neo-button bg-neo-pink text-white px-2 py-1 text-xs' : 'neo-button-tab px-2 py-1 text-xs'}
              >
                <Star size={12} className="inline mr-1" />
                {task.urgent ? 'Urgent' : 'Mark Urgent'}
              </button>
              <button
                onClick={() => hideUntilLater(task.id)}
                className="neo-button-tab px-2 py-1 text-xs"
              >
                Close Until Later
              </button>
              <label className="neo-button-tab px-2 py-1 text-xs cursor-pointer">
                <Upload size={12} className="inline mr-1" />
                Before
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadTaskImage(task.id, 'before', e.target.files[0])}
                />
              </label>
              <label className="neo-button-tab px-2 py-1 text-xs cursor-pointer">
                <Upload size={12} className="inline mr-1" />
                After
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadTaskImage(task.id, 'after', e.target.files[0])}
                />
              </label>
            </div>
          )}
        </div>

        {/* Images on the right */}
        <div className="flex gap-2 flex-shrink-0">
          {task.image_url && (
            <img
              src={task.image_url}
              alt={task.title}
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover border-4 border-black cursor-pointer hover:scale-105 transition-transform rounded-xl"
              onClick={() => setSelectedImage(task.image_url)}
            />
          )}
          {task.before_image_url && (
            <img
              src={task.before_image_url}
              alt="Before"
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover border-4 border-black cursor-pointer hover:scale-105 transition-transform rounded-xl"
              onClick={() => setSelectedImage(task.before_image_url)}
            />
          )}
          {task.after_image_url && (
            <img
              src={task.after_image_url}
              alt="After"
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover border-4 border-black cursor-pointer hover:scale-105 transition-transform rounded-xl"
              onClick={() => setSelectedImage(task.after_image_url)}
            />
          )}
        </div>

        {isManagerView && (
          <button
            onClick={() => deleteTask(task.id)}
            className="neo-button-danger p-2 flex-shrink-0"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="neo-card p-4 sm:p-6 bg-gradient-to-br from-neo-blue/10 to-neo-green/10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Employee To-Do List</h2>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neo-input w-full mb-4"
          />
        </div>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={activeTab === 'pending' ? 'neo-button-tab-active' : 'neo-button-tab'}
          >
            Pending ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={activeTab === 'completed' ? 'neo-button-tab-active' : 'neo-button-tab'}
          >
            Completed ({tasks.filter(t => t.completed).length})
          </button>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto neo-scrollbar">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              {searchTerm ? 'No tasks found matching your search' : `No ${activeTab} tasks`}
            </p>
          )}
        </div>
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};
