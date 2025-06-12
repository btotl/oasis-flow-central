
import { useState } from 'react';
import { Plus, Minus, Printer, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export const ReceiptMaker = () => {
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [currentItem, setCurrentItem] = useState({ name: '', quantity: 1, price: 0 });
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Plant Nursery',
    address: '123 Garden Street',
    phone: '(555) 123-4567',
    email: 'info@plantnursery.com'
  });
  const [customNote, setCustomNote] = useState('Thank you for your business!');
  const [showPreview, setShowPreview] = useState(false);

  const addItem = () => {
    if (currentItem.name.trim() && currentItem.price > 0) {
      const newItem: ReceiptItem = {
        id: Date.now().toString(),
        ...currentItem
      };
      setItems([...items, newItem]);
      setCurrentItem({ name: '', quantity: 1, price: 0 });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const generateReceiptContent = () => {
    const total = calculateTotal();
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    return `
${businessInfo.name}
${businessInfo.address}
${businessInfo.phone}
${businessInfo.email}

================================
          RECEIPT
================================
Date: ${date}
Time: ${time}

--------------------------------
ITEMS:
--------------------------------
${items.map(item => 
  `${item.name}
  ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`
).join('\n\n')}

--------------------------------
TOTAL: $${total.toFixed(2)}
--------------------------------

${customNote}

================================
Thank you for shopping with us!
================================
    `.trim();
  };

  const handlePrint = () => {
    const receiptContent = generateReceiptContent();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                font-size: 12px;
                line-height: 1.4;
                margin: 0;
                padding: 20px;
                max-width: 300px;
              }
              pre {
                white-space: pre-wrap;
                margin: 0;
              }
            </style>
          </head>
          <body>
            <pre>${receiptContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-yellow/20 to-neo-orange/20">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Receipt Maker</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Item Entry */}
        <div className="space-y-4">
          <h4 className="font-bold text-lg">Add Items</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                value={currentItem.name}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>
            <div>
              <Label htmlFor="item-quantity">Quantity</Label>
              <Input
                id="item-quantity"
                type="number"
                min="1"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label htmlFor="item-price">Price ($)</Label>
              <Input
                id="item-price"
                type="number"
                step="0.01"
                min="0"
                value={currentItem.price}
                onChange={(e) => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <Button onClick={addItem} className="neo-button bg-neo-green text-white w-full">
            <Plus size={16} className="mr-2" />
            Add Item
          </Button>

          {/* Items List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg border-2 border-black">
                <div className="flex-1">
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      size="sm"
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 p-0"
                    >
                      <Minus size={12} />
                    </Button>
                    <span className="text-sm">{item.quantity}</span>
                    <Button
                      size="sm"
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 p-0"
                    >
                      <Plus size={12} />
                    </Button>
                    <span className="text-sm">× ${item.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${(item.quantity * item.price).toFixed(2)}</div>
                  <Button
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="mt-1 bg-red-500 text-white"
                  >
                    <Minus size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="bg-neo-green/20 p-4 rounded-lg border-2 border-black">
              <div className="text-xl font-bold">Total: ${calculateTotal().toFixed(2)}</div>
            </div>
          )}
        </div>

        {/* Business Info & Actions */}
        <div className="space-y-4">
          <h4 className="font-bold text-lg">Business Information</h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="business-address">Address</Label>
              <Input
                id="business-address"
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="business-phone">Phone</Label>
              <Input
                id="business-phone"
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="business-email">Email</Label>
              <Input
                id="business-email"
                value={businessInfo.email}
                onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="custom-note">Custom Note</Label>
              <Textarea
                id="custom-note"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button className="neo-button bg-neo-blue text-white w-full">
                  <Eye size={16} className="mr-2" />
                  Preview Receipt
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Receipt Preview</DialogTitle>
                </DialogHeader>
                <div className="bg-white p-4 rounded border font-mono text-xs overflow-auto max-h-96">
                  <pre className="whitespace-pre-wrap">{generateReceiptContent()}</pre>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={handlePrint} 
              disabled={items.length === 0}
              className="neo-button bg-neo-green text-white w-full"
            >
              <Printer size={16} className="mr-2" />
              Print Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
