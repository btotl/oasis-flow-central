
import { useState } from 'react';
import { Maximize2, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CustomerRequest {
  id: string;
  category: 'indoor' | 'outdoor' | 'pots' | 'tools' | 'other';
  commonName: string;
  botanicalName: string;
  size: string;
  customerName: string;
  phone: string;
  date: Date;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'sourcing' | 'available' | 'fulfilled';
  notes: string;
  archived: boolean;
}

interface CustomerRequestModalProps {
  onClose: () => void;
}

export const CustomerRequestModal = ({ onClose }: CustomerRequestModalProps) => {
  const [requests, setRequests] = useState<CustomerRequest[]>([
    {
      id: '1',
      category: 'indoor',
      commonName: 'Bird of Paradise',
      botanicalName: 'Strelitzia reginae',
      size: 'Large (6-8 feet)',
      customerName: 'Emma Wilson',
      phone: '555-0199',
      date: new Date(2024, 5, 8),
      urgency: 'medium',
      status: 'sourcing',
      notes: 'Customer wants mature plant for living room centerpiece',
      archived: false
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    category: 'indoor' as const,
    commonName: '',
    botanicalName: '',
    size: '',
    customerName: '',
    phone: '',
    urgency: 'medium' as const,
    notes: ''
  });

  const addRequest = () => {
    if (newRequest.commonName && newRequest.customerName) {
      const request: CustomerRequest = {
        id: Date.now().toString(),
        ...newRequest,
        date: new Date(),
        status: 'pending',
        archived: false
      };
      setRequests([...requests, request]);
      setNewRequest({
        category: 'indoor',
        commonName: '',
        botanicalName: '',
        size: '',
        customerName: '',
        phone: '',
        urgency: 'medium',
        notes: ''
      });
    }
  };

  const updateStatus = (id: string, status: CustomerRequest['status']) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status } : request
    ));
  };

  const archiveRequest = (id: string) => {
    setRequests(requests.map(request =>
      request.id === id ? { ...request, archived: true } : request
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'sourcing': return 'bg-blue-500';
      case 'available': return 'bg-green-500';
      case 'fulfilled': return 'bg-gray-500';
      default: return 'bg-gray-500';
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

  const activeRequests = requests.filter(r => !r.archived);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 max-w-6xl max-h-[90vh] overflow-auto w-full rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">Customer Requests</h2>
            <Link
              to="/requests"
              className="p-2 bg-neo-blue text-white rounded-xl border-4 border-black hover:bg-blue-600"
              title="Open full page view"
            >
              <Maximize2 size={20} />
            </Link>
          </div>
          <button
            onClick={onClose}
            className="neo-button-danger"
          >
            <X size={20} />
          </button>
        </div>

        {/* Add new request */}
        <div className="neo-card p-4 mb-6 bg-neo-green/20 rounded-2xl">
          <h3 className="text-xl font-bold mb-4">Add New Request</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={newRequest.category}
              onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value as any })}
              className="neo-input"
            >
              <option value="indoor">Indoor Plants</option>
              <option value="outdoor">Outdoor Plants</option>
              <option value="pots">Pots & Containers</option>
              <option value="tools">Tools & Accessories</option>
              <option value="other">Other</option>
            </select>
            
            <input
              type="text"
              placeholder="Common Name"
              value={newRequest.commonName}
              onChange={(e) => setNewRequest({ ...newRequest, commonName: e.target.value })}
              className="neo-input"
            />
            
            <input
              type="text"
              placeholder="Botanical Name (optional)"
              value={newRequest.botanicalName}
              onChange={(e) => setNewRequest({ ...newRequest, botanicalName: e.target.value })}
              className="neo-input"
            />
            
            <input
              type="text"
              placeholder="Size/Specifications"
              value={newRequest.size}
              onChange={(e) => setNewRequest({ ...newRequest, size: e.target.value })}
              className="neo-input"
            />
            
            <input
              type="text"
              placeholder="Customer Name"
              value={newRequest.customerName}
              onChange={(e) => setNewRequest({ ...newRequest, customerName: e.target.value })}
              className="neo-input"
            />
            
            <input
              type="tel"
              placeholder="Phone Number"
              value={newRequest.phone}
              onChange={(e) => setNewRequest({ ...newRequest, phone: e.target.value })}
              className="neo-input"
            />
            
            <select
              value={newRequest.urgency}
              onChange={(e) => setNewRequest({ ...newRequest, urgency: e.target.value as any })}
              className="neo-input"
            >
              <option value="low">Low Urgency</option>
              <option value="medium">Medium Urgency</option>
              <option value="high">High Urgency</option>
            </select>
            
            <textarea
              placeholder="Additional notes..."
              value={newRequest.notes}
              onChange={(e) => setNewRequest({ ...newRequest, notes: e.target.value })}
              className="neo-input md:col-span-2 h-20 resize-none"
            />
          </div>
          <button
            onClick={addRequest}
            className="neo-button bg-neo-green text-white mt-4"
          >
            Add Request
          </button>
        </div>

        {/* Requests list */}
        <div className="space-y-4">
          {activeRequests.map((request) => (
            <div key={request.id} className="neo-card p-4 bg-white relative rounded-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs font-bold bg-black text-white px-2 py-1 uppercase rounded-lg">
                      {request.category}
                    </span>
                    <span className={`text-xs font-bold text-white px-2 py-1 rounded-lg ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency}
                    </span>
                  </div>
                  <p className="font-bold text-lg">{request.commonName}</p>
                  {request.botanicalName && (
                    <p className="text-gray-600 italic">{request.botanicalName}</p>
                  )}
                  {request.size && (
                    <p className="text-gray-600">{request.size}</p>
                  )}
                </div>
                
                <div>
                  <p className="text-gray-900 font-medium">{request.customerName}</p>
                  <p className="text-gray-600">{request.phone}</p>
                  <p className="text-gray-600 text-sm">
                    Requested: {request.date.toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  {request.notes && (
                    <>
                      <p className="text-gray-600 text-sm font-bold mb-1">Notes:</p>
                      <p className="text-gray-900 text-sm">{request.notes}</p>
                    </>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className={`text-xs font-bold text-white px-3 py-2 text-center rounded-lg ${getStatusColor(request.status)}`}>
                    {request.status.toUpperCase()}
                  </span>
                  <select
                    value={request.status}
                    onChange={(e) => updateStatus(request.id, e.target.value as any)}
                    className="neo-input text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="sourcing">Sourcing</option>
                    <option value="available">Available</option>
                    <option value="fulfilled">Fulfilled</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => archiveRequest(request.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg border-2 border-black hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
