import { useState } from 'react';
import { Maximize2, Trash2, X } from 'lucide-react';

interface Voucher {
  id: string;
  voucherNumber: string;
  recipientName: string;
  fromName: string;
  amount: number;
  usedAmount: number;
  creationDate: Date;
}

interface GiftVoucherModalProps {
  onClose: () => void;
}

export const GiftVoucherModal = ({ onClose }: GiftVoucherModalProps) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([
    {
      id: '1',
      voucherNumber: 'V001',
      recipientName: 'John Smith',
      fromName: 'Mary Johnson',
      amount: 100,
      usedAmount: 30,
      creationDate: new Date(2024, 5, 1)
    }
  ]);

  const [newVoucher, setNewVoucher] = useState({
    voucherNumber: '',
    recipientName: '',
    fromName: '',
    amount: 0
  });

  const [useAmount, setUseAmount] = useState<{ [key: string]: number }>({});

  const addVoucher = () => {
    if (newVoucher.voucherNumber && newVoucher.recipientName && newVoucher.amount > 0) {
      const voucher: Voucher = {
        id: Date.now().toString(),
        ...newVoucher,
        usedAmount: 0,
        creationDate: new Date()
      };
      setVouchers([...vouchers, voucher]);
      setNewVoucher({ voucherNumber: '', recipientName: '', fromName: '', amount: 0 });
    }
  };

  const useVoucher = (id: string) => {
    const amount = useAmount[id] || 0;
    if (amount > 0) {
      setVouchers(vouchers.map(voucher => {
        if (voucher.id === id && (voucher.usedAmount + amount) <= voucher.amount) {
          return { ...voucher, usedAmount: voucher.usedAmount + amount };
        }
        return voucher;
      }));
      setUseAmount({ ...useAmount, [id]: 0 });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 max-w-4xl max-h-[90vh] overflow-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">Gift Voucher Log</h2>
            <button
              onClick={() => console.log('Open full vouchers page')}
              className="p-2 bg-neo-blue text-white rounded-lg border-2 border-black hover:bg-blue-600"
              title="Open full page view"
            >
              <Maximize2 size={20} />
            </button>
          </div>
          <button
            onClick={onClose}
            className="neo-button-danger"
          >
            <X size={20} />
          </button>
        </div>

        {/* Add new voucher */}
        <div className="neo-card p-4 mb-6 bg-neo-pink/20">
          <h3 className="text-xl font-bold mb-4">Add New Voucher</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Voucher Number"
              value={newVoucher.voucherNumber}
              onChange={(e) => setNewVoucher({ ...newVoucher, voucherNumber: e.target.value })}
              className="neo-input"
            />
            <input
              type="text"
              placeholder="Recipient Name"
              value={newVoucher.recipientName}
              onChange={(e) => setNewVoucher({ ...newVoucher, recipientName: e.target.value })}
              className="neo-input"
            />
            <input
              type="text"
              placeholder="From Name"
              value={newVoucher.fromName}
              onChange={(e) => setNewVoucher({ ...newVoucher, fromName: e.target.value })}
              className="neo-input"
            />
            <input
              type="number"
              placeholder="Amount ($)"
              value={newVoucher.amount || ''}
              onChange={(e) => setNewVoucher({ ...newVoucher, amount: parseFloat(e.target.value) || 0 })}
              className="neo-input"
            />
          </div>
          <button
            onClick={addVoucher}
            className="neo-button bg-neo-green text-white mt-4"
          >
            Add Voucher
          </button>
        </div>

        {/* Vouchers list */}
        <div className="space-y-4">
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="neo-card p-4 bg-white relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-bold text-lg">#{voucher.voucherNumber}</p>
                  <p className="text-gray-600">To: {voucher.recipientName}</p>
                  <p className="text-gray-600">From: {voucher.fromName}</p>
                  <p className="text-gray-600">Created: {voucher.creationDate.toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="font-bold">Amount: ${voucher.amount}</p>
                  <p className="text-red-600">Used: ${voucher.usedAmount}</p>
                  <p className="text-green-600 font-bold">
                    Balance: ${voucher.amount - voucher.usedAmount}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <input
                    type="number"
                    placeholder="Amount to use"
                    value={useAmount[voucher.id] || ''}
                    onChange={(e) => setUseAmount({
                      ...useAmount,
                      [voucher.id]: parseFloat(e.target.value) || 0
                    })}
                    className="neo-input"
                    max={voucher.amount - voucher.usedAmount}
                  />
                  <button
                    onClick={() => useVoucher(voucher.id)}
                    className="neo-button bg-neo-blue text-white"
                    disabled={voucher.amount - voucher.usedAmount <= 0}
                  >
                    Use Amount
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => console.log('Delete voucher', voucher.id)}
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
