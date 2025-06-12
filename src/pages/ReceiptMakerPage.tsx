import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Printer, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface BusinessInfo {
  business_name: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  business_abn: string;
  logo_url: string;
  receipt_footer: string;
  receipt_header: string;
}

const ReceiptMakerPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, price: 0 });
  const [customerName, setCustomerName] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    business_name: 'Plant Nursery',
    business_address: '123 Garden Street, Green Valley',
    business_phone: '(555) 123-4567',
    business_email: 'info@plantnursery.com',
    business_abn: 'ABN 12 345 678 901',
    logo_url: '',
    receipt_footer: 'Thank you for your business!',
    receipt_header: 'Welcome to our Plant Nursery'
  });

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .in('setting_key', [
          'business_name', 'business_address', 'business_phone', 
          'business_email', 'business_abn', 'logo_url',
          'receipt_footer', 'receipt_header'
        ]);

      if (error) throw error;

      const settingsMap = data?.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value || '';
        return acc;
      }, {} as Record<string, string>) || {};

      setBusinessInfo(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error fetching business info:', error);
    }
  };

  const addItem = () => {
    if (newItem.name && newItem.price > 0) {
      const item: ReceiptItem = {
        id: Date.now().toString(),
        name: newItem.name,
        quantity: newItem.quantity,
        price: newItem.price,
        total: newItem.quantity * newItem.price
      };
      setItems([...items, item]);
      setNewItem({ name: '', quantity: 1, price: 0 });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ));
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt</title>
        <style>
          @media print {
            @page { margin: 0; size: 80mm auto; }
            body { font-family: monospace; font-size: 12px; margin: 0; padding: 5mm; width: 70mm; }
          }
          body { font-family: monospace; font-size: 12px; margin: 0; padding: 10px; max-width: 300px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .line { border-bottom: 1px solid #000; margin: 5px 0; }
          .item { display: flex; justify-content: space-between; margin: 2px 0; }
          .total { border-top: 2px solid #000; padding-top: 5px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="center">
          ${businessInfo.logo_url ? `<img src="${businessInfo.logo_url}" style="max-width: 60px; max-height: 60px;" />` : ''}
          <div class="bold" style="font-size: 14px;">${businessInfo.business_name}</div>
          <div>${businessInfo.business_address}</div>
          <div>${businessInfo.business_phone}</div>
          <div>${businessInfo.business_email}</div>
          <div>${businessInfo.business_abn}</div>
          ${businessInfo.receipt_header ? `<div class="bold" style="margin-top: 5px;">${businessInfo.receipt_header}</div>` : ''}
        </div>
        
        <div class="line"></div>
        
        ${customerName ? `<div><strong>Customer:</strong> ${customerName}</div><div class="line"></div>` : ''}
        
        ${items.map(item => `
          <div class="item">
            <span>${item.name} x${item.quantity}</span>
            <span>$${item.total.toFixed(2)}</span>
          </div>
        `).join('')}
        
        <div class="total">
          <div class="item bold">
            <span>TOTAL</span>
            <span>$${getTotalAmount().toFixed(2)}</span>
          </div>
        </div>
        
        <div class="center" style="margin-top: 10px;">
          <div style="font-size: 10px;">${new Date().toLocaleString()}</div>
          ${customNotes ? `<div style="margin-top: 5px;">${customNotes}</div>` : ''}
          ${businessInfo.receipt_footer ? `<div style="margin-top: 5px;">${businessInfo.receipt_footer}</div>` : ''}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="neo-card p-4 sm:p-6 mb-4 sm:mb-6 rounded-3xl bg-gradient-to-r from-neo-green/20 to-neo-blue/20">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/')}
              className="neo-button bg-gray-500 text-white"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
              Receipt Maker
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receipt Builder */}
          <div className="neo-card p-6 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6">Create Receipt</h2>
            
            {/* Customer Info */}
            <div className="mb-6">
              <Label htmlFor="customer-name">Customer Name (Optional)</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>

            {/* Add Item Form */}
            <div className="bg-gray-100 p-4 rounded-xl mb-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ShoppingCart size={20} />
                Add Item
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <Label htmlFor="item-quantity">Quantity</Label>
                  <Input
                    id="item-quantity"
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="item-price">Price ($)</Label>
                  <Input
                    id="item-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <Button onClick={addItem} className="neo-button bg-neo-green text-white">
                <Plus size={16} className="mr-2" />
                Add Item
              </Button>
            </div>

            {/* Items List */}
            <div className="mb-6">
              <h3 className="font-bold mb-4">Items ({items.length})</h3>
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items added yet</p>
              ) : (
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white border-2 border-gray-300 p-3 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-600">× ${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">${item.total.toFixed(2)}</span>
                        <Button 
                          onClick={() => removeItem(item.id)}
                          className="neo-button bg-red-500 text-white p-2"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="bg-gray-900 text-white p-4 rounded-lg">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>TOTAL</span>
                      <span>${getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Notes */}
            <div className="mb-6">
              <Label htmlFor="custom-notes">Custom Notes</Label>
              <Textarea
                id="custom-notes"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Add custom message for this receipt"
                rows={3}
              />
            </div>

            {/* Print Button */}
            <Button 
              onClick={printReceipt}
              disabled={items.length === 0}
              className="neo-button bg-neo-blue text-white w-full"
            >
              <Printer size={20} className="mr-2" />
              Print Receipt (ESC/POS)
            </Button>
          </div>

          {/* Receipt Preview */}
          <div className="neo-card p-6 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6">Receipt Preview</h2>
            
            <div className="bg-white border-4 border-black p-6 rounded-xl max-w-sm mx-auto font-mono text-sm">
              <div className="text-center border-b-2 border-black pb-4 mb-4">
                {businessInfo.logo_url && (
                  <img src={businessInfo.logo_url} alt="Logo" className="w-20 h-20 mx-auto mb-2 object-contain" />
                )}
                <h3 className="font-bold text-lg">{businessInfo.business_name}</h3>
                <p className="text-xs">{businessInfo.business_address}</p>
                <p className="text-xs">{businessInfo.business_phone}</p>
                <p className="text-xs">{businessInfo.business_email}</p>
                <p className="text-xs">{businessInfo.business_abn}</p>
                {businessInfo.receipt_header && (
                  <p className="text-xs mt-2 font-bold">{businessInfo.receipt_header}</p>
                )}
              </div>
              
              {customerName && (
                <div className="border-b border-gray-300 pb-2 mb-2">
                  <p className="font-bold">Customer: {customerName}</p>
                </div>
              )}
              
              <div className="border-b border-gray-300 pb-2 mb-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between mb-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-b-2 border-black pb-2 mb-4">
                <div className="flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-center text-xs">
                <p>{new Date().toLocaleString()}</p>
                {customNotes && (
                  <p className="mt-2">{customNotes}</p>
                )}
                {businessInfo.receipt_footer && (
                  <p className="mt-2">{businessInfo.receipt_footer}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptMakerPage;
