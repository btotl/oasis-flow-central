
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Trash2 } from 'lucide-react';

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

const LaybyPage = () => {
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

  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newLayby, setNewLayby] = useState({
    laybyNumber: '',
    customerName: '',
    phone: '',
    items: '',
    total: 0,
    deposit: 0
  });

  const filteredLaybys = laybys.filter(layby => {
    const matchesSearch = layby.laybyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         layby.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArchived = showArchived ? layby.archived : !layby.archived;
    return matchesSearch && matchesArchived;
  });

  const paginatedLaybys = filteredLaybys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLaybys.length / itemsPerPage);

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

  const archiveLayby = (id: string) => {
    setLaybys(laybys.map(layby =>
      layby.id === id ? { ...layby, archived: true } : layby
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="neo-card p-6 mb-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/" className="neo-button">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Layby Tracker</h1>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search laybys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neo-input w-full pl-10"
              />
            </div>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={showArchived ? 'neo-button-tab-active' : 'neo-button-tab'}
            >
              {showArchived ? 'Show Active' : 'Show Archived'}
            </button>
          </div>

          {/* Add new layby form */}
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
          <div className="space-y-4 mb-6">
            {paginatedLaybys.map((layby) => (
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

                  <div className="flex items-center justify-end">
                    {layby.archived ? (
                      <span className="bg-gray-500 text-white px-4 py-2 font-bold border-4 border-black rounded-xl">
                        ARCHIVED
                      </span>
                    ) : (
                      <button
                        onClick={() => archiveLayby(layby.id)}
                        className="neo-button-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
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
};

export default LaybyPage;
