
import { useState, useEffect } from 'react';
import { Plus, Search, Bell, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomerRequest {
  id: string;
  category: string;
  common_name: string;
  botanical_name?: string;
  size_specs?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  urgency: string;
  status: string;
  notes?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  requested_by_name?: string;
  created_at: string;
  updated_at: string;
}

export const CustomerRequestTracking = () => {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [requestForm, setRequestForm] = useState({
    category: 'indoor',
    common_name: '',
    botanical_name: '',
    size_specs: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    urgency: 'medium',
    notes: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('customer_requests')
        .insert({
          ...requestForm,
          requested_by_name: profile?.first_name
        });

      if (error) throw error;
      setRequestForm({
        category: 'indoor',
        common_name: '',
        botanical_name: '',
        size_specs: '',
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        urgency: 'medium',
        notes: ''
      });
      setShowAddRequest(false);
      fetchRequests();
    } catch (error) {
      console.error('Error adding request:', error);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('customer_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'sourcing': return 'bg-blue-500';
      case 'available': return 'bg-green-500';
      case 'fulfilled': return 'bg-gray-500';
      case 'archived': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.botanical_name && request.botanical_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="text-center py-4">Loading requests...</div>;

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-green/20 to-neo-orange/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Requests</h3>
        <Dialog open={showAddRequest} onOpenChange={setShowAddRequest}>
          <DialogTrigger asChild>
            <Button className="neo-button bg-neo-green text-white">
              <Plus size={16} className="mr-2" />
              Add Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Customer Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={requestForm.category} 
                    onValueChange={(value) => setRequestForm({ ...requestForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor Plants</SelectItem>
                      <SelectItem value="outdoor">Outdoor Plants</SelectItem>
                      <SelectItem value="pots">Pots & Containers</SelectItem>
                      <SelectItem value="tools">Tools & Supplies</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select 
                    value={requestForm.urgency} 
                    onValueChange={(value) => setRequestForm({ ...requestForm, urgency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="common-name">Common Name</Label>
                <Input
                  id="common-name"
                  value={requestForm.common_name}
                  onChange={(e) => setRequestForm({ ...requestForm, common_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="botanical-name">Botanical Name</Label>
                <Input
                  id="botanical-name"
                  value={requestForm.botanical_name}
                  onChange={(e) => setRequestForm({ ...requestForm, botanical_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="size-specs">Size Specifications</Label>
                <Input
                  id="size-specs"
                  value={requestForm.size_specs}
                  onChange={(e) => setRequestForm({ ...requestForm, size_specs: e.target.value })}
                  placeholder="e.g., 15cm pot, 2m height"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    value={requestForm.customer_name}
                    onChange={(e) => setRequestForm({ ...requestForm, customer_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer-phone">Customer Phone</Label>
                  <Input
                    id="customer-phone"
                    value={requestForm.customer_phone}
                    onChange={(e) => setRequestForm({ ...requestForm, customer_phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="customer-email">Customer Email</Label>
                <Input
                  id="customer-email"
                  type="email"
                  value={requestForm.customer_email}
                  onChange={(e) => setRequestForm({ ...requestForm, customer_email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={requestForm.notes}
                  onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                  placeholder="Additional details about the request"
                />
              </div>
              <Button type="submit" className="neo-button bg-neo-blue text-white">
                Add Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sourcing">Sourcing</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="fulfilled">Fulfilled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <div className="space-y-4 max-h-96 overflow-y-auto neo-scrollbar">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No requests found</div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="bg-white border-4 border-black p-4 rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-lg">{request.common_name}</h4>
                  {request.botanical_name && (
                    <p className="text-sm italic text-gray-600">{request.botanical_name}</p>
                  )}
                  <p className="text-sm text-gray-700">{request.customer_name}</p>
                  {request.customer_phone && (
                    <p className="text-sm text-gray-600">{request.customer_phone}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency.toUpperCase()}
                  </span>
                  <Select
                    value={request.status}
                    onValueChange={(value) => updateRequestStatus(request.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sourcing">Sourcing</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="fulfilled">Fulfilled</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="ml-2 capitalize">{request.category}</span>
                </div>
                {request.size_specs && (
                  <div>
                    <span className="font-medium text-gray-700">Size:</span>
                    <span className="ml-2">{request.size_specs}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="ml-2">{new Date(request.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {request.notes && (
                <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-700">{request.notes}</p>
                </div>
              )}

              <div className="mt-3 flex justify-between items-center">
                <div className={`inline-flex items-center gap-1 text-xs font-bold text-white px-2 py-1 rounded-lg ${getStatusColor(request.status)}`}>
                  {request.status === 'available' && <Bell size={12} />}
                  {request.status === 'fulfilled' && <CheckCircle size={12} />}
                  {request.status.toUpperCase()}
                </div>
                {request.requested_by_name && (
                  <span className="text-xs text-gray-500">
                    Requested by: {request.requested_by_name}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
