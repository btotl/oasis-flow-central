
import { useState } from 'react';
import { ImageModal } from './ImageModal';

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

  return (
    <>
      <div className="neo-card p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">📋 Employee To-Do List</h2>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`neo-card p-4 transition-all duration-200 ${
                task.completed ? 'bg-neo-green/20' : 'bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="neo-checkbox mt-1"
                />
                
                {task.imageUrl && (
                  <img
                    src={task.imageUrl}
                    alt={task.title}
                    className="w-16 h-16 object-cover border-4 border-black cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedImage(task.imageUrl)}
                  />
                )}
                
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  <p className={`text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
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
