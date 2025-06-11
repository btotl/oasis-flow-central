
import { useState } from 'react';
import { Eye, Clock, ArrowRight } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { CustomerRequest } from '@/types/database';

export const LatestCustomerRequests = () => {
  const { data: requests } = useSupabaseData<CustomerRequest>('customer_requests');
  const [showModal, setShowModal] = useState(false);

  const latestRequests = requests
    .filter(r => r.status !== 'archived')
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'sourcing': return 'bg-blue-500';
      case 'available': return 'bg-green-500';
      case 'fulfilled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'indoor': return 'bg-green-600';
      case 'outdoor': return 'bg-blue-600';
      case 'pots': return 'bg-orange-600';
      case 'tools': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-green/20 to-neo-blue/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Latest Customer Requests</h3>
        <button
          onClick={() => setShowModal(true)}
          className="neo-button bg-blue-500 text-white flex items-center gap-2"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {latestRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent customer requests
          </div>
        ) : (
          latestRequests.map((request) => (
            <div key={request.id} className="bg-white border-4 border-black p-4 rounded-2xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <span className={`text-xs font-bold text-white px-2 py-1 rounded-lg ${getCategoryColor(request.category)}`}>
                      {request.category.toUpperCase()}
                    </span>
                    <span className={`text-xs font-bold text-white px-2 py-1 rounded-lg ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency.toUpperCase()}
                    </span>
                    <span className={`text-xs font-bold text-white px-2 py-1 rounded-lg ${getStatusColor(request.status)}`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-lg text-gray-900">{request.common_name}</h4>
                  {request.botanical_name && (
                    <p className="text-gray-600 italic text-sm">{request.botanical_name}</p>
                  )}
                  <p className="text-gray-700 font-medium">{request.customer_name}</p>
                  {request.customer_phone && (
                    <p className="text-gray-600 text-sm">{request.customer_phone}</p>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <Clock size={12} />
                    {new Date(request.created_at).toLocaleDateString()}
                  </div>
                  <button className="neo-button bg-blue-500 text-white p-2">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
              
              {request.notes && (
                <div className="mt-3 pt-3 border-t-2 border-gray-200">
                  <p className="text-sm text-gray-600">{request.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
