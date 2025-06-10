
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Trash2 } from 'lucide-react';

interface Voucher {
  id: string;
  voucherNumber: string;
  recipientName: string;
  fromName: string;
  amount: number;
  usedAmount: number;
  creationDate: Date;
  archived: boolean;
}

const VouchersPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([
    {
      id: '1',
      voucherNumber: 'V001',
      recipientName: 'John Smith',
      fromName: 'Mary Johnson',
      amount: 100,
      usedAmount: 30,
      creationDate: new Date(2024, 5, 1),
      archived: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newVoucher, setNewVoucher] = useState({
    voucherNumber: '',
    recipientName: '',
    fromName: '',
    amount: 0
  });

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArchived = showArchived ? voucher.archived : !voucher.archived;
    return matchesSearch && matchesArchived;
  });

  const paginatedVouchers = filteredVouchers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);

  const addVoucher = () => {
    if (newVoucher.voucherNumber && newVoucher.recipientName && newVoucher.amount > 0) {
      const voucher: Voucher = {
        id: Date.now().toString(),
        ...newVoucher,
        usedAmount: 0,
        creationDate: new Date(),
        archived: false
      };
      setVouchers([...vouchers, voucher]);
      setNewVoucher({ voucherNumber: '', recipientName: '', fromName: '', amount: 0 });
    }
  };

  const archiveVoucher = (id: string) => {
    setVouchers(vouchers.map(voucher =>
      voucher.id === id ? { ...voucher, archived: true } : voucher
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
            <h1 className="text-4xl font-bold text-gray-900">Gift Vouchers</h1>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search vouchers..."
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

          {/* Add new voucher form */}
          <div className="neo-card p-4 mb-6 bg-neo-pink/20 rounded-2xl">
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
          <div className="space-y-4 mb-6">
            {paginatedVouchers.map((voucher) => (
              <div key={voucher.id} className="neo-card p-4 bg-white relative rounded-2xl">
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
                  
                  <div className="flex items-center justify-end">
                    {voucher.archived ? (
                      <span className="bg-gray-500 text-white px-4 py-2 font-bold border-4 border-black rounded-xl">
                        ARCHIVED
                      </span>
                    ) : (
                      <button
                        onClick={() => archiveVoucher(voucher.id)}
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

export default VouchersPage;
