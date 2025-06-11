
import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Upload, Eye, Calendar, Clock, Archive } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/types/database';

interface TaskListProps {
  isManagerView?: boolean;
}

export const TaskList = ({ isManagerView = false }: TaskListProps) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Filter out hidden tasks for employee view
      const now = new Date();
      const filteredTasks = isManagerView 
        ? data || []
        : (data || []).filter((task: any) => 
            !task.hidden_until || new Date(task.hidden_until) <= now
          );
      
      setTasks(filteredTasks as Task[]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed, updated_at: new Date().toISOString() })
        .eq('id', taskId);
      
      if (error) throw error;
      
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const markUrgent = async (taskId: string, urgent: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ urgent, updated_at: new Date().toISOString() })
        .eq('id', taskId);
      
      if (error) throw error;
      
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, urgent } : task
      ));
    } catch (error) {
      console.error('Error updating task urgency:', error);
    }
  };

  const hideTask = async (taskId: string, hours: number = 2) => {
    const hiddenUntil = new Date();
    hiddenUntil.setHours(hiddenUntil.getHours() + hours);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          hidden_until: hiddenUntil.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Remove from current view for employees
      if (!isManagerView) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error('Error hiding task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  if (loading) return <div className="p-4">Loading tasks...</div>;

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {isManagerView ? 'Manage Tasks' : 'To-Do List'}
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'neo-button-tab-active' : 'neo-button-tab'}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={filter === 'incomplete' ? 'neo-button-tab-active' : 'neo-button-tab'}
          >
            To Do ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'neo-button-tab-active' : 'neo-button-tab'}
          >
            Done ({tasks.filter(t => t.completed).length})
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto neo-scrollbar">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks found. {isManagerView ? 'Add some tasks to get started!' : 'Great job - all caught up!'}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white border-4 border-black rounded-2xl overflow-hidden">
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Left side - Checkbox and content */}
                  <div className="flex-1 flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(task.id, !task.completed)}
                      className="mt-1 flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-green-500" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        {task.urgent && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-bold">
                            URGENT
                          </span>
                        )}
                        {task.priority && task.priority !== 'medium' && (
                          <span className={`text-xs px-2 py-1 rounded-lg font-bold ${
                            task.priority === 'high' ? 'bg-orange-500 text-white' :
                            task.priority === 'low' ? 'bg-blue-500 text-white' : ''
                          }`}>
                            {task.priority.toUpperCase()}
                          </span>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className={`text-sm mb-2 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                          {task.description}
                        </p>
                      )}
                      
                      {task.due_date && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <Calendar size={12} />
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {!isManagerView && (
                          <>
                            <button
                              onClick={() => markUrgent(task.id, !task.urgent)}
                              className={`text-xs px-2 py-1 rounded-lg border-2 border-black font-bold ${
                                task.urgent 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-white text-gray-700 hover:bg-red-100'
                              }`}
                            >
                              {task.urgent ? 'Remove Urgent' : 'Mark Urgent'}
                            </button>
                            <button
                              onClick={() => hideTask(task.id)}
                              className="text-xs px-2 py-1 rounded-lg border-2 border-black bg-yellow-500 text-white font-bold hover:bg-yellow-600"
                            >
                              <Clock size={12} className="inline mr-1" />
                              Hide 2hrs
                            </button>
                          </>
                        )}
                        
                        {(task.before_image_url || task.after_image_url) && (
                          <button className="text-xs px-2 py-1 rounded-lg border-2 border-black bg-blue-500 text-white font-bold">
                            <Eye size={12} className="inline mr-1" />
                            View Images
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side - Image */}
                  {task.image_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={task.image_url}
                        alt="Task reference"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-black"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
