
import { useState } from 'react';
import { X, RotateCcw, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseData } from '@/hooks/useSupabaseData';

interface ArchiveManagerProps {
  onClose: () => void;
}

export const ArchiveManager = ({ onClose }: ArchiveManagerProps) => {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'laybys' | 'customer_requests'>('vouchers');
  
  const { data: vouchers, refetch: refetchVouchers } = useSupabaseData('vouchers');
  const { data: laybys, refetch: refetchLaybys } = useSupabaseData('laybys');
  const { data: customerRequests, refetch: refetchRequests } = useSupabaseData('customer_requests');

  const archivedVouchers = vouchers.filter((v: any) => v.status === 'archived');
  const archivedLaybys = laybys.filter((l: any) => l.status === 'archived');
  const archivedRequests = customerRequests.filter((r: any) => r.status === 'archived');

  const handleRestore = async (table: 'vouchers' | 'laybys' | 'customer_requests', id: string) => {
    try {
      const { error } = await supabase
        .from(table as any)
        .update({ status: 'active' })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refetch data
      if (table === 'vouchers') refetchVouchers();
      if (table === 'laybys') refetchLaybys();
      if (table === 'customer_requests') refetchRequests();
    } catch (err) {
      console.error(`Error restoring ${table}:`, err);
    }
  };

  const handlePermanentDelete = async (table: 'vouchers' | 'laybys' | 'customer_requests', id: string) => {
    try {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refetch data
      if (table === 'vouchers') refetchVouchers();
      if (table === 'laybys') refetchLaybys();
      if (table === 'customer_requests') refetchRequests();
    } catch (err) {
      console.error(`Error deleting ${table}:`, err);
    }
  };

  const renderArchivedItems = () => {
    switch (activeTab) {
      case 'vouchers':
        return archivedVouchers.map((voucher: any) => (
          <div key={voucher.id} className="bg-white border-4 border-black p-4 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg">{voucher.code}</h4>
                <p className="text-gray-600">{voucher.customer_name}</p>
                <p className="text-sm text-gray-500">Amount: ${voucher.amount}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRestore('vouchers', voucher.id)}
                  className="neo-button bg-green-500 text-white p-2"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => handlePermanentDelete('vouchers', voucher.id)}
                  className="neo-button bg-red-500 text-white p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ));
      
      case 'laybys':
        return archivedLaybys.map((layby: any) => (
          <div key={layby.id} className="bg-white border-4 border-black p-4 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg">{layby.layby_number}</h4>
                <p className="text-gray-600">{layby.customer_name}</p>
                <p className="text-sm text-gray-500">Total: ${layby.total_amount}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRestore('laybys', layby.id)}
                  className="neo-button bg-green-500 text-white p-2"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => handlePermanentDelete('laybys', layby.id)}
                  className="neo-button bg-red-500 text-white p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ));
      
      case 'customer_requests':
        return archivedRequests.map((request: any) => (
          <div key={request.id} className="bg-white border-4 border-black p-4 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg">{request.common_name}</h4>
                <p className="text-gray-600">{request.customer_name}</p>
                <p className="text-sm text-gray-500">Category: {request.category}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRestore('customer_requests', request.id)}
                  className="neo-button bg-green-500 text-white p-2"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => handlePermanentDelete('customer_requests', request.id)}
                  className="neo-button bg-red-500 text-white p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ));
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Archive Manager</h2>
          <button
            onClick={onClose}
            className="neo-button text-gray-600 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`neo-button-tab ${activeTab === 'vouchers' ? 'active' : ''}`}
          >
            Vouchers ({archivedVouchers.length})
          </button>
          <button
            onClick={() => setActiveTab('laybys')}
            className={`neo-button-tab ${activeTab === 'laybys' ? 'active' : ''}`}
          >
            Laybys ({archivedLaybys.length})
          </button>
          <button
            onClick={() => setActiveTab('customer_requests')}
            className={`neo-button-tab ${activeTab === 'customer_requests' ? 'active' : ''}`}
          >
            Requests ({archivedRequests.length})
          </button>
        </div>

        <div className="space-y-3">
          {renderArchivedItems()}
          {renderArchivedItems()?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No archived items in this category
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
