
import { useState } from 'react';
import { ImageModal } from './ImageModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  imageUrl?: string;
}

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Water greenhouse plants',
      description: 'Check soil moisture and water all plants in greenhouse section A',
      completed: false,
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop'
    },
    {
      id: '2',
      title: 'Repot succulents',
      description: 'Move overgrown succulents to larger pots with fresh soil mix',
      completed: true,
      imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f2360af03e?w=200&h=200&fit=crop'
    },
    {
      id: '3',
      title: 'Stock outdoor display',
      description: 'Arrange new seasonal plants in the front display area',
      completed: false
    }
  ]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  const TaskItem = ({ task }: { task: Task }) => (
    <div
      className={`neo-card p-4 transition-all duration-200 ${
        task.completed ? 'bg-neo-green/20' : 'bg-white'
      }`}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
          className="neo-checkbox mt-1 flex-shrink-0"
        />
        
        {task.imageUrl && (
          <img
            src={task.imageUrl}
            alt={task.title}
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover border-4 border-black cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
            onClick={() => setSelectedImage(task.imageUrl)}
          />
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg sm:text-xl font-bold break-words ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          <p className={`text-sm sm:text-base text-gray-600 mt-1 break-words ${task.completed ? 'line-through' : ''}`}>
            {task.description}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="neo-card p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Employee To-Do List</h2>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pending" className="font-bold">
              Pending ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="font-bold">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <div className="space-y-4 max-h-96 overflow-y-auto neo-scrollbar">
              {pendingTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
              {pendingTasks.length === 0 && (
                <p className="text-gray-500 text-center py-8">No pending tasks</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="space-y-4 max-h-96 overflow-y-auto neo-scrollbar">
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
              {completedTasks.length === 0 && (
                <p className="text-gray-500 text-center py-8">No completed tasks</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
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
