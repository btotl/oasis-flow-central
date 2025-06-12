
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Consignor {
  id: string;
  name: string;
  phone: string;
  email?: string;
  created_at: string;
}

interface ConsignmentItem {
  id: string;
  consignor_id: string;
  item_name: string;
  quantity: number;
  quantity_sold: number;
  cost_per_item: number;
  profit_per_item: number;
  created_at: string;
}

interface ConsignorWithItems extends Consignor {
  items: ConsignmentItem[];
  totalOwed: number;
  totalProfit: number;
}

export const Consignments = () => {
  const { profile } = useAuth();
  const [consignors, setConsignors] = useState<ConsignorWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddConsignor, setShowAddConsignor] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedConsignor, setSelectedConsignor] = useState<string | null>(null);
  const [consignorForm, setConsignorForm] = useState({ name: '', phone: '', email: '' });
  const [itemForm, setItemForm] = useState({
    item_name: '',
    quantity: 0,
    quantity_sold: 0,
    cost_per_item: 0,
    profit_per_item: 0
  });

  useEffect(() => {
    if (profile?.role === 'manager') {
      fetchConsignments();
    }
  }, [profile]);

  const fetchConsignments = async () => {
    try {
      const { data: consignorsData, error: consignorsError } = await supabase
        .from('consignors')
        .select('*')
        .order('created_at', { ascending: false });

      if (consignorsError) throw consignorsError;

      const { data: itemsData, error: itemsError } = await supabase
        .from('consignment_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;

      const consignorsWithItems: ConsignorWithItems[] = (consignorsData || []).map(consignor => {
        const items = (itemsData || []).filter(item => item.consignor_id === consignor.id);
        const totalOwed = items.reduce((sum, item) => sum + (item.quantity_sold * item.cost_per_item), 0);
        const totalProfit = items.reduce((sum, item) => sum + (item.quantity_sold * item.profit_per_item), 0);
        
        return {
          ...consignor,
          items,
          totalOwed,
          totalProfit
        };
      });

      setConsignors(consignorsWithItems);
    } catch (error) {
      console.error('Error fetching consignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddConsignor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('consignors')
        .insert(consignorForm);

      if (error) throw error;
      setConsignorForm({ name: '', phone: '', email: '' });
      setShowAddConsignor(false);
      fetchConsignments();
    } catch (error) {
      console.error('Error adding consignor:', error);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsignor) return;

    try {
      const { error } = await supabase
        .from('consignment_items')
        .insert({
          ...itemForm,
          consignor_id: selectedConsignor
        });

      if (error) throw error;
      setItemForm({
        item_name: '',
        quantity: 0,
        quantity_sold: 0,
        cost_per_item: 0,
        profit_per_item: 0
      });
      setShowAddItem(false);
      setSelectedConsignor(null);
      fetchConsignments();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const updateItemSold = async (itemId: string, quantitySold: number) => {
    try {
      const { error } = await supabase
        .from('consignment_items')
        .update({ quantity_sold: quantitySold })
        .eq('id', itemId);

      if (error) throw error;
      fetchConsignments();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  if (profile?.role !== 'manager') return null;

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-green/20 to-neo-blue/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Consignments</h3>
        <Dialog open={showAddConsignor} onOpenChange={setShowAddConsignor}>
          <DialogTrigger asChild>
            <Button className="neo-button bg-neo-green text-white">
              <Plus size={16} className="mr-2" />
              Add Consignor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Consignor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddConsignor} className="space-y-4">
              <div>
                <Label htmlFor="consignor-name">Name</Label>
                <Input
                  id="consignor-name"
                  value={consignorForm.name}
                  onChange={(e) => setConsignorForm({ ...consignorForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="consignor-phone">Phone</Label>
                <Input
                  id="consignor-phone"
                  value={consignorForm.phone}
                  onChange={(e) => setConsignorForm({ ...consignorForm, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="consignor-email">Email</Label>
                <Input
                  id="consignor-email"
                  type="email"
                  value={consignorForm.email}
                  onChange={(e) => setConsignorForm({ ...consignorForm, email: e.target.value })}
                />
              </div>
              <Button type="submit" className="neo-button bg-neo-blue text-white">
                Add Consignor
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto neo-scrollbar">
        {loading ? (
          <div className="text-center py-4">Loading consignments...</div>
        ) : consignors.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No consignors yet</div>
        ) : (
          consignors.map((consignor) => (
            <div key={consignor.id} className="bg-white border-4 border-black p-4 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-lg">{consignor.name}</h4>
                  <p className="text-gray-600">{consignor.phone}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-green-600">
                      <DollarSign size={14} />
                      Owed: ${consignor.totalOwed.toFixed(2)}
                    </span>
                    <span className="flex items-center gap-1 text-blue-600">
                      <Package size={14} />
                      Profit: ${consignor.totalProfit.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSelectedConsignor(consignor.id);
                    setShowAddItem(true);
                  }}
                  className="neo-button bg-neo-yellow text-black text-sm"
                >
                  <Plus size={14} className="mr-1" />
                  Add Item
                </Button>
              </div>

              {consignor.items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-2">Item</th>
                        <th className="text-center p-2">Total</th>
                        <th className="text-center p-2">Sold</th>
                        <th className="text-center p-2">Cost Each</th>
                        <th className="text-center p-2">Profit Each</th>
                        <th className="text-center p-2">Amount Owed</th>
                        <th className="text-center p-2">Business Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consignor.items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-2 font-medium">{item.item_name}</td>
                          <td className="text-center p-2">{item.quantity}</td>
                          <td className="text-center p-2">
                            <Input
                              type="number"
                              value={item.quantity_sold}
                              onChange={(e) => updateItemSold(item.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center"
                              min="0"
                              max={item.quantity}
                            />
                          </td>
                          <td className="text-center p-2">${item.cost_per_item.toFixed(2)}</td>
                          <td className="text-center p-2">${item.profit_per_item.toFixed(2)}</td>
                          <td className="text-center p-2 font-medium text-green-600">
                            ${(item.quantity_sold * item.cost_per_item).toFixed(2)}
                          </td>
                          <td className="text-center p-2 font-medium text-blue-600">
                            ${(item.quantity_sold * item.profit_per_item).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Consignment Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                value={itemForm.item_name}
                onChange={(e) => setItemForm({ ...itemForm, item_name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity-total">Total Quantity</Label>
                <Input
                  id="quantity-total"
                  type="number"
                  value={itemForm.quantity}
                  onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="quantity-sold">Quantity Sold</Label>
                <Input
                  id="quantity-sold"
                  type="number"
                  value={itemForm.quantity_sold}
                  onChange={(e) => setItemForm({ ...itemForm, quantity_sold: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cost-per-item">Cost Per Item ($)</Label>
                <Input
                  id="cost-per-item"
                  type="number"
                  step="0.01"
                  value={itemForm.cost_per_item}
                  onChange={(e) => setItemForm({ ...itemForm, cost_per_item: parseFloat(e.target.value) || 0 })}
                  required
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="profit-per-item">Profit Per Item ($)</Label>
                <Input
                  id="profit-per-item"
                  type="number"
                  step="0.01"
                  value={itemForm.profit_per_item}
                  onChange={(e) => setItemForm({ ...itemForm, profit_per_item: parseFloat(e.target.value) || 0 })}
                  required
                  min="0"
                />
              </div>
            </div>
            <Button type="submit" className="neo-button bg-neo-blue text-white">
              Add Item
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
