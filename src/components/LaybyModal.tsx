
import { useState } from 'react';
import { Maximize2, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Layby {
  id: string;
  laybyNumber: string;
  customerName: string;
  phone: string;
  items: string;
  total: number;
  deposit: number;
  balance: number;
  creationDate: Date;
  archived: boolean;
}

interface LaybyModalProps {
  onClose: () => void;
}

export const LaybyModal = ({ onClose }: LaybyModalProps) => {
  const [laybys, setLaybys] = useState<Layby[]>([
    {
      id: '1',
      laybyNumber: 'L001',
      customerName: 'Alice Brown',
      phone: '555-0123',
      items: 'Fiddle Leaf Fig, Monstera Deliciosa, 2x Ceramic Pots',
      total: 280,
      deposit: 100,
      balance: 180,
      creationDate: new Date(2024, 5, 5),
      archived: false
    }
  ]);

  const [newLayby, setNewLayby] = useState({
    laybyNumber: '',
    customerName: '',
    phone: '',
    items: '',
    total: 0,
    deposit: 0
  });

  const [additionalPayment, setAdditionalPayment] = useState<{ [key: string]: number }>({});

  const addLayby = () => {
    if (newLayby.laybyNumber && newLayby.customerName && newLayby.total > 0) {
      const layby: Layby = {
        id: Date.now().toString(),
        ...newLayby,
        balance: newLayby.total - newLayby.deposit,
        creationDate: new Date(),
        archived: false
      };
      setLaybys([...laybys, layby]);
      setNewLayby({
        laybyNumber: '', 
        customerName: '', 
        phone: '', 
        items: '', 
        total: 0, 
        deposit: 0
      });
    }
  };

  const addPayment = (id: string) => {
    const payment = additionalPayment[id] || 0;
    if (payment > 0) {
      setLaybys(laybys.map(layby => {
        if (layby.id === id && payment <= layby.balance) {
          return { 
            ...layby, 
            deposit: layby.deposit + payment,
            balance: layby.balance - payment
          };
        }
        return layby;
      }));
      setAdditionalPayment({ ...additionalPayment, [id]: 0 });
    }
  };

  const archiveLayby = (id: string) => {
    setLaybys(laybys.map(layby =>
      layby.id === id ? { ...layby, archived: true } : layby
    ));
  };

  const activeLaybys = laybys.filter(l => !l.archived);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 max-w-6xl max-h-[90vh] overflow-auto w-full rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold">Layby Tracker</h2>
            <Link
              to="/laybys"
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

        {/* Add new layby */}
        <div className="neo-card p-4 mb-6 bg-neo-blue/20 rounded-2xl">
          <h3 className="text-xl font-bold mb-4">Add New Layby</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Layby Number"
              value={newLayby.laybyNumber}
              onChange={(e) => setNewLayby({ ...newLayby, laybyNumber: e.target.value })}
              className="neo-input"
            />
            <input
              type="text"
              placeholder="Customer Name"
              value={newLayby.customerName}
              onChange={(e) => setNewLayby({ ...newLayby, customerName: e.target.value })}
              className="neo-input"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newLayby.phone}
              onChange={(e) => setNewLayby({ ...newLayby, phone: e.target.value })}
              className="neo-input"
            />
            <input
              type="text"
              placeholder="Items"
              value={newLayby.items}
              onChange={(e) => setNewLayby({ ...newLayby, items: e.target.value })}
              className="neo-input md:col-span-2"
            />
            <input
              type="number"
              placeholder="Total ($)"
              value={newLayby.total || ''}
              onChange={(e) => setNewLayby({ ...newLayby, total: parseFloat(e.target.value) || 0 })}
              className="neo-input"
            />
            <input
              type="number"
              placeholder="Deposit ($)"
              value={newLayby.deposit || ''}
              onChange={(e) => setNewLayby({ ...newLayby, deposit: parseFloat(e.target.value) || 0 })}
              className="neo-input"
            />
          </div>
          <button
            onClick={addLayby}
            className="neo-button bg-neo-green text-white mt-4"
          >
            Add Layby
          </button>
        </div>

        {/* Laybys list */}
        <div className="space-y-4">
          {activeLaybys.map((layby) => (
            <div key={layby.id} className="neo-card p-4 bg-white relative rounded-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div>
                  <p className="font-bold text-lg">#{layby.laybyNumber}</p>
                  <p className="text-gray-900 font-medium">{layby.customerName}</p>
                  <p className="text-gray-600">{layby.phone}</p>
                  <p className="text-gray-600 text-sm">
                    Created: {layby.creationDate.toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600 text-sm font-bold mb-1">Items:</p>
                  <p className="text-gray-900">{layby.items}</p>
                </div>
                
                <div>
                  <p className="font-bold">Total: ${layby.total}</p>
                  <p className="text-green-600">Paid: ${layby.deposit}</p>
                  <p className={`font-bold ${layby.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    Balance: ${layby.balance}
                  </p>
                </div>
                
                {layby.balance > 0 && (
                  <div className="flex flex-col gap-2">
                    <input
                      type="number"
                      placeholder="Additional payment"
                      value={additionalPayment[layby.id] || ''}
                      onChange={(e) => setAdditionalPayment({
                        ...additionalPayment,
                        [layby.id]: parseFloat(e.target.value) || 0
                      })}
                      className="neo-input"
                      max={layby.balance}
                    />
                    <button
                      onClick={() => addPayment(layby.id)}
                      className="neo-button bg-neo-green text-white"
                    >
                      Add Payment
                    </button>
                  </div>
                )}
                
                {layby.balance === 0 && (
                  <div className="flex items-center">
                    <span className="bg-green-500 text-white px-4 py-2 font-bold border-4 border-black rounded-xl">
                      PAID IN FULL
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => archiveLayby(layby.id)}
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
