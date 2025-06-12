
import { useState, useEffect } from 'react';
import { Plus, Edit, Award, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LoyaltyCustomer {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  points_balance: number;
  total_points_earned: number;
  total_points_redeemed: number;
  created_at: string;
}

interface LoyaltyTransaction {
  id: string;
  customer_id: string;
  points_change: number;
  transaction_type: string;
  description?: string;
  created_by?: string;
  created_at: string;
}

export const CustomerLoyalty = () => {
  const { profile } = useAuth();
  const [customers, setCustomers] = useState<LoyaltyCustomer[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAdjustPoints, setShowAdjustPoints] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customerForm, setCustomerForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: ''
  });
  const [pointsForm, setPointsForm] = useState({
    points_change: 0,
    transaction_type: 'adjustment',
    description: ''
  });

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      const { data: customersData, error: customersError } = await supabase
        .from('customer_loyalty')
        .select('*')
        .order('customer_name');

      if (customersError) throw customersError;

      const { data: transactionsData, error: transactionsError } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsError) throw transactionsError;

      setCustomers(customersData || []);
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('customer_loyalty')
        .insert(customerForm);

      if (error) throw error;
      setCustomerForm({ customer_name: '', customer_email: '', customer_phone: '' });
      setShowAddCustomer(false);
      fetchLoyaltyData();
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      // Add transaction
      const { error: transactionError } = await supabase
        .from('loyalty_transactions')
        .insert({
          customer_id: selectedCustomer,
          ...pointsForm,
          created_by: profile?.first_name
        });

      if (transactionError) throw transactionError;

      // Update customer balance
      const customer = customers.find(c => c.id === selectedCustomer);
      if (customer) {
        const newBalance = customer.points_balance + pointsForm.points_change;
        const { error: updateError } = await supabase
          .from('customer_loyalty')
          .update({
            points_balance: newBalance,
            total_points_earned: pointsForm.points_change > 0 
              ? customer.total_points_earned + pointsForm.points_change 
              : customer.total_points_earned,
            total_points_redeemed: pointsForm.points_change < 0 
              ? customer.total_points_redeemed + Math.abs(pointsForm.points_change) 
              : customer.total_points_redeemed
          })
          .eq('id', selectedCustomer);

        if (updateError) throw updateError;
      }

      setPointsForm({ points_change: 0, transaction_type: 'adjustment', description: '' });
      setShowAdjustPoints(false);
      setSelectedCustomer(null);
      fetchLoyaltyData();
    } catch (error) {
      console.error('Error adjusting points:', error);
    }
  };

  if (loading) return <div className="text-center py-4">Loading loyalty data...</div>;

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-purple/20 to-neo-yellow/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Loyalty</h3>
        <div className="flex gap-2">
          <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
            <DialogTrigger asChild>
              <Button className="neo-button bg-neo-purple text-white">
                <Plus size={16} className="mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Loyalty Customer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    value={customerForm.customer_name}
                    onChange={(e) => setCustomerForm({ ...customerForm, customer_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={customerForm.customer_email}
                    onChange={(e) => setCustomerForm({ ...customerForm, customer_email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="customer-phone">Phone</Label>
                  <Input
                    id="customer-phone"
                    value={customerForm.customer_phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, customer_phone: e.target.value })}
                  />
                </div>
                <Button type="submit" className="neo-button bg-neo-blue text-white">
                  Add Customer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customers List */}
        <div>
          <h4 className="font-bold text-lg mb-3">Customers</h4>
          <div className="space-y-3 max-h-80 overflow-y-auto neo-scrollbar">
            {customers.map((customer) => (
              <div key={customer.id} className="bg-white border-4 border-black p-4 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold">{customer.customer_name}</h5>
                    {customer.customer_email && (
                      <p className="text-sm text-gray-600">{customer.customer_email}</p>
                    )}
                    {customer.customer_phone && (
                      <p className="text-sm text-gray-600">{customer.customer_phone}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedCustomer(customer.id);
                      setShowAdjustPoints(true);
                    }}
                    className="neo-button bg-neo-yellow text-black text-sm"
                  >
                    <Edit size={14} className="mr-1" />
                    Adjust
                  </Button>
                </div>
                <div className="mt-3 flex gap-4 text-sm">
                  <span className="flex items-center gap-1 text-purple-600">
                    <Award size={14} />
                    Balance: {customer.points_balance} pts
                  </span>
                  <span className="flex items-center gap-1 text-green-600">
                    <TrendingUp size={14} />
                    Earned: {customer.total_points_earned} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h4 className="font-bold text-lg mb-3">Recent Transactions</h4>
          <div className="space-y-2 max-h-80 overflow-y-auto neo-scrollbar">
            {transactions.map((transaction) => {
              const customer = customers.find(c => c.id === transaction.customer_id);
              return (
                <div key={transaction.id} className="bg-white border-2 border-gray-300 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{customer?.customer_name || 'Unknown Customer'}</p>
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.points_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.points_change > 0 ? '+' : ''}{transaction.points_change} pts
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={showAdjustPoints} onOpenChange={setShowAdjustPoints}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Points</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdjustPoints} className="space-y-4">
            <div>
              <Label htmlFor="points-change">Points Change</Label>
              <Input
                id="points-change"
                type="number"
                value={pointsForm.points_change}
                onChange={(e) => setPointsForm({ ...pointsForm, points_change: parseInt(e.target.value) || 0 })}
                required
                placeholder="Use negative numbers to deduct points"
              />
            </div>
            <div>
              <Label htmlFor="transaction-type">Transaction Type</Label>
              <Select 
                value={pointsForm.transaction_type} 
                onValueChange={(value) => setPointsForm({ ...pointsForm, transaction_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="earned">Earned</SelectItem>
                  <SelectItem value="redeemed">Redeemed</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={pointsForm.description}
                onChange={(e) => setPointsForm({ ...pointsForm, description: e.target.value })}
                placeholder="Reason for points adjustment"
              />
            </div>
            <Button type="submit" className="neo-button bg-neo-purple text-white">
              Adjust Points
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
