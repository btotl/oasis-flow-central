
import { useState } from 'react';

interface UrgentItem {
  id: string;
  title: string;
  category: 'task' | 'voucher' | 'layby' | 'request';
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  description: string;
}

export const UrgentItems = () => {
  const [urgentItems] = useState<UrgentItem[]>([
    {
      id: '1',
      title: 'Check Bird of Paradise availability',
      category: 'request',
      priority: 'high',
      dueDate: new Date(2024, 5, 12),
      description: 'Customer Emma Wilson needs large Bird of Paradise for living room'
    },
    {
      id: '2', 
      title: 'Process layby payment',
      category: 'layby',
      priority: 'medium',
      description: 'Alice Brown - $180 remaining balance'
    },
    {
      id: '3',
      title: 'Voucher expires soon',
      category: 'voucher', 
      priority: 'medium',
      description: 'John Smith voucher #V001 - $70 remaining'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'task': return 'bg-blue-500';
      case 'voucher': return 'bg-purple-500';
      case 'layby': return 'bg-orange-500';
      case 'request': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Urgent Items</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto neo-scrollbar">
        {urgentItems.map((item) => (
          <div key={item.id} className="bg-white border-4 border-black p-4 rounded-2xl">
            <div className="flex gap-2 mb-2">
              <span className={`text-xs font-bold text-white px-2 py-1 rounded-lg ${getPriorityColor(item.priority)}`}>
                {item.priority.toUpperCase()}
              </span>
              <span className={`text-xs font-bold text-white px-2 py-1 rounded-lg ${getCategoryColor(item.category)}`}>
                {item.category.toUpperCase()}
              </span>
            </div>
            <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
            {item.dueDate && (
              <p className="text-xs text-red-600 font-bold">
                Due: {item.dueDate.toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
