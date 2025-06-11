
import { useState } from 'react';
import { ArrowLeft, Plus, Minus, Search } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { CustomerCredit } from '@/types/database';

interface CustomerCreditModalProps {
  onClose: () => void;
}

export const CustomerCreditModal = ({ onClose }: CustomerCreditModalProps) => {
  const { data: credits, loading, refetch } = useSupabaseData<CustomerCredit>('customer_credit');
  const [showFullView, setShowFullView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newCredit, setNewCredit] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    credit_amount: 0,
    notes: ''
  });

  const itemsPerPage = 10;

  const addCredit = async () => {
    if (!newCredit.customer_name || newCredit.credit_amount <= 0) return;

    try {
      const { error } = await supabase
        .from('customer_credit')
        .insert([{
          ...newCredit,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setNewCredit({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        credit_amount: 0,
        notes: ''
      });
      
      refetch();
    } catch (error) {
      console.error('Error adding credit:', error);
    }
  };

  const adjustCredit = async (id: string, adjustment: number) => {
    const credit = credits.find(c => c.id === id);
    if (!credit) return;

    const newAmount = Math.max(0, credit.credit_amount + adjustment);

    try {
      const { error } = await supabase
        .from('customer_credit')
        .update({ 
          credit_amount: newAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error adjusting credit:', error);
    }
  };

  const filteredCredits = credits.filter(credit =>
    credit.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credit.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credit.customer_phone?.includes(searchTerm)
  );

  const paginatedCredits = filteredCredits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCredits.length / itemsPerPage);

  if (showFullView) {
    return (
      <div className="fixed inset-0 bg-gray-100 z-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4">
          <div className="neo-card p-6 mb-6 rounded-3xl">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setShowFullView(false)} 
                className="neo-button"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-4xl font-bold text-gray-900">Customer Credit Management</h1>
            </div>

            {/* Search and filters */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="neo-input w-full pl-10"
                />
              </div>
            </div>

            {/* Credit list */}
            <div className="space-y-4 mb-6">
              {paginatedCredits.map((credit) => (
                <div key={credit.id} className="neo-card p-4 bg-white rounded-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                    <div>
                      <h3 className="font-bold text-lg">{credit.customer_name}</h3>
                      {credit.customer_email && (
                        <p className="text-gray-600 text-sm">{credit.customer_email}</p>
                      )}
                      {credit.customer_phone && (
                        <p className="text-gray-600 text-sm">{credit.customer_phone}</p>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        ${credit.credit_amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Current Balance</p>
                    </div>
                    
                    <div>
                      {credit.notes && (
                        <p className="text-sm text-gray-600">{credit.notes}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Added: {new Date(credit.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => adjustCredit(credit.id, 10)}
                        className="neo-button bg-green-500 text-white flex items-center gap-1"
                      >
                        <Plus size={16} />
                        $10
                      </button>
                      <button
                        onClick={() => adjustCredit(credit.id, -10)}
                        className="neo-button bg-red-500 text-white flex items-center gap-1"
                      >
                        <Minus size={16} />
                        $10
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? 'neo-button-tab-active' : 'neo-button-tab'}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 max-w-2xl w-full rounded-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Customer Credit</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFullView(true)}
              className="neo-button bg-blue-500 text-white"
            >
              Full View
            </button>
            <button onClick={onClose} className="neo-button">✕</button>
          </div>
        </div>

        {/* Add new credit form */}
        <div className="neo-card p-4 mb-6 bg-neo-green/20 rounded-2xl">
          <h3 className="text-xl font-bold mb-4">Add Customer Credit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={newCredit.customer_name}
              onChange={(e) => setNewCredit({...newCredit, customer_name: e.target.value})}
              className="neo-input"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={newCredit.customer_email}
              onChange={(e) => setNewCredit({...newCredit, customer_email: e.target.value})}
              className="neo-input"
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={newCredit.customer_phone}
              onChange={(e) => setNewCredit({...newCredit, customer_phone: e.target.value})}
              className="neo-input"
            />
            <input
              type="number"
              placeholder="Credit Amount"
              value={newCredit.credit_amount || ''}
              onChange={(e) => setNewCredit({...newCredit, credit_amount: parseFloat(e.target.value) || 0})}
              className="neo-input"
              min="0"
              step="0.01"
            />
            <textarea
              placeholder="Notes (optional)"
              value={newCredit.notes}
              onChange={(e) => setNewCredit({...newCredit, notes: e.target.value})}
              className="neo-input md:col-span-2 h-20 resize-none"
            />
          </div>
          <button
            onClick={addCredit}
            className="neo-button bg-neo-green text-white mt-4"
          >
            Add Credit
          </button>
        </div>

        {/* Credit list */}
        <div className="space-y-3 max-h-64 overflow-y-auto neo-scrollbar">
          {credits.slice(0, 5).map((credit) => (
            <div key={credit.id} className="bg-white border-4 border-black p-4 rounded-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{credit.customer_name}</h4>
                  <p className="text-green-600 font-bold">${credit.credit_amount.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => adjustCredit(credit.id, 10)}
                    className="neo-button bg-green-500 text-white p-2"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => adjustCredit(credit.id, -10)}
                    className="neo-button bg-red-500 text-white p-2"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {credits.length > 5 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowFullView(true)}
              className="neo-button bg-blue-500 text-white"
            >
              View All {credits.length} Credits
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
