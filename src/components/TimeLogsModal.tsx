
import { useState, useEffect } from 'react';
import { X, Search, Calendar } from 'lucide-react';

interface TimeEntry {
  id: string;
  employeeName: string;
  clockIn: Date;
  clockOut?: Date;
  totalHours?: number;
  date: string;
}

interface TimeLogsModalProps {
  onClose: () => void;
}

export const TimeLogsModal = ({ onClose }: TimeLogsModalProps) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Load time entries from localStorage or database
    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
      const entries = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        clockIn: new Date(entry.clockIn),
        clockOut: entry.clockOut ? new Date(entry.clockOut) : undefined
      }));
      setTimeEntries(entries);
    }
  }, []);

  const filteredEntries = timeEntries.filter(entry => {
    const matchesSearch = entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || entry.date === new Date(dateFilter).toDateString();
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage);

  const getTotalHours = (entries: TimeEntry[]) => {
    return entries.reduce((total, entry) => total + (entry.totalHours || 0), 0).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 w-full max-w-6xl h-[80vh] rounded-3xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Employee Time Logs</h2>
          <button
            onClick={onClose}
            className="p-2 bg-red-500 text-white rounded-2xl border-4 border-black hover:bg-red-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neo-input w-full pl-10"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="neo-input w-full pl-10"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-neo-blue/20 border-4 border-black p-4 rounded-2xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold">{filteredEntries.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold">{getTotalHours(filteredEntries)}h</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold">
                {filteredEntries.filter(entry => !entry.clockOut).length}
              </p>
            </div>
          </div>
        </div>

        {/* Time Entries Table */}
        <div className="flex-1 overflow-auto neo-scrollbar">
          <div className="space-y-2">
            {paginatedEntries.map((entry) => (
              <div key={entry.id} className="bg-white border-4 border-black p-4 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Employee</p>
                    <p className="font-bold">{entry.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-bold">{entry.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Clock In/Out</p>
                    <p className="text-sm">
                      In: {entry.clockIn.toLocaleTimeString()}
                      {entry.clockOut && (
                        <><br />Out: {entry.clockOut.toLocaleTimeString()}</>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p className="font-bold text-green-600">
                      {entry.totalHours ? `${entry.totalHours}h` : 'Active'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-2xl border-4 border-black font-bold ${
                  currentPage === i + 1
                    ? 'bg-neo-blue text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
