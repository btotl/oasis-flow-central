
import { useState } from 'react';
import { ArrowLeft, Search, RotateCcw, Trash2 } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { Voucher, Layby, CustomerRequest } from '@/types/database';

interface ArchiveManagerProps {
  onClose: () => void;
}

export const ArchiveManager = ({ onClose }: ArchiveManagerProps) => {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'laybys' | 'requests'>('vouchers');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: vouchers, refetch: refetchVouchers } = useSupabaseData<Voucher>('vouchers');
  const { data: laybys, refetch: refetchLaybys } = useSupabaseData<Layby>('laybys');
  const { data: requests, refetch: refetchRequests } = useSupabaseData<CustomerRequest>('customer_requests');

  const archivedVouchers = vouchers.filter(v => v.status === 'archived');
  const archivedLaybys = laybys.filter(l => l.status === 'archived');
  const archivedRequests = requests.filter(r => r.status === 'archived');

  const restoreItem = async (table: string, id: string, refetch: () => void) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error restoring item:', error);
    }
  };

  const deleteItem = async (table: string, id: string, refetch: () => void) => {
    if (!confirm('Are you sure you want to permanently delete this item?')) return;
    
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filterItems = (items: any[]) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      Object.values(item).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const renderVouchers = () => {
    const filteredVouchers = filterItems(archivedVouchers);
    
    return (
      <div className="space-y-3">
        {filteredVouchers.map((voucher) => (
          <div key={voucher.id} className="bg-white border-4 border-black p-4 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{voucher.code}</h3>
                <p className="text-gray-600">{voucher.customer_name}</p>
                <p className="text-sm text-gray-500">
                  ${voucher.amount} • Used: ${voucher.used_amount}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => restoreItem('vouchers', voucher.id, refetchVouchers)}
                  className="neo-button bg-green-500 text-white p-2"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => deleteItem('vouchers', voucher.id, refetchVouchers)}
                  className="neo-button bg-red-500 text-white p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLaybys = () => {
    const filteredLaybys = filterItems(archivedLaybys);
    
    return (
      <div className="space-y-3">
        {filteredLaybys.map((layby) => (
          <div key={layby.id} className="bg-white border-4 border-black p-4 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{layby.layby_number}</h3>
                <p className="text-gray-600">{layby.customer_name}</p>
                <p className="text-sm text-gray-500">
                  Total: ${layby.total_amount} • Remaining: ${layby.remaining_amount}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => restoreItem('laybys', layby.id, refetchLaybys)}
                  className="neo-button bg-green-500 text-white p-2"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => deleteItem('laybys', layby.id, refetchLaybys)}
                  className="neo-button bg-red-500 text-white p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRequests = () => {
    const filteredRequests = filterItems(archivedRequests);
    
    return (
      <div className="space-y-3">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white border-4 border-black p-4 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{request.common_name}</h3>
                <p className="text-gray-600">{request.customer_name}</p>
                <p className="text-sm text-gray-500">
                  {request.category} • {request.urgency} priority
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => restoreItem('customer_requests', request.id, refetchRequests)}
                  className="neo-button bg-green-500 text-white p-2"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => deleteItem('customer_requests', request.id, refetchRequests)}
                  className="neo-button bg-red-500 text-white p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 max-w-4xl w-full rounded-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onClose} className="neo-button">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Archive Manager</h2>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search archived items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neo-input w-full pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('vouchers')}
            className={activeTab === 'vouchers' ? 'neo-button-tab-active' : 'neo-button-tab'}
          >
            Vouchers ({archivedVouchers.length})
          </button>
          <button
            onClick={() => setActiveTab('laybys')}
            className={activeTab === 'laybys' ? 'neo-button-tab-active' : 'neo-button-tab'}
          >
            Laybys ({archivedLaybys.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={activeTab === 'requests' ? 'neo-button-tab-active' : 'neo-button-tab'}
          >
            Requests ({archivedRequests.length})
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto neo-scrollbar">
          {activeTab === 'vouchers' && renderVouchers()}
          {activeTab === 'laybys' && renderLaybys()}
          {activeTab === 'requests' && renderRequests()}
        </div>
      </div>
    </div>
  );
};
