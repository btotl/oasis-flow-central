
import { useState, useEffect } from 'react';

interface TimeEntry {
  id: string;
  employeeName: string;
  clockIn: Date;
  clockOut?: Date;
  totalHours?: number;
  date: string;
}

export const TimeTracking = () => {
  const [isClocked, setIsClocked] = useState(false);
  const [currentSession, setCurrentSession] = useState<Date | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    const now = new Date();
    setIsClocked(true);
    setCurrentSession(now);
    
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      employeeName: localStorage.getItem('employeeName') || 'Employee',
      clockIn: now,
      date: now.toDateString()
    };
    
    setTimeEntries(prev => [...prev, newEntry]);
  };

  const handleClockOut = () => {
    if (currentSession) {
      const now = new Date();
      const totalHours = (now.getTime() - currentSession.getTime()) / (1000 * 60 * 60);
      
      setTimeEntries(prev => 
        prev.map(entry => 
          entry.clockIn === currentSession 
            ? { ...entry, clockOut: now, totalHours: Math.round(totalHours * 100) / 100 }
            : entry
        )
      );
      
      setIsClocked(false);
      setCurrentSession(null);
    }
  };

  const getCurrentSessionDuration = () => {
    if (!currentSession) return '00:00:00';
    
    const diff = currentTime.getTime() - currentSession.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Time Tracking</h3>
      
      <div className="text-center mb-6">
        <div className="text-3xl font-bold mb-2">{currentTime.toLocaleTimeString()}</div>
        {isClocked && (
          <div className="text-xl font-bold text-green-600">
            Session: {getCurrentSessionDuration()}
          </div>
        )}
      </div>
      
      <div className="flex gap-3 mb-6">
        {!isClocked ? (
          <button
            onClick={handleClockIn}
            className="neo-button bg-green-500 text-white flex-1"
          >
            Clock In
          </button>
        ) : (
          <button
            onClick={handleClockOut}
            className="neo-button bg-red-500 text-white flex-1"
          >
            Clock Out
          </button>
        )}
      </div>
      
      <div className="space-y-2 max-h-40 overflow-y-auto neo-scrollbar">
        <h4 className="font-bold text-sm text-gray-900">Recent Entries</h4>
        {timeEntries.slice(-5).reverse().map((entry) => (
          <div key={entry.id} className="bg-white border-2 border-black p-2 rounded-xl text-sm">
            <div className="flex justify-between">
              <span>{entry.date}</span>
              {entry.totalHours && <span className="font-bold">{entry.totalHours}h</span>}
            </div>
            <div className="text-xs text-gray-600">
              In: {entry.clockIn.toLocaleTimeString()}
              {entry.clockOut && ` | Out: ${entry.clockOut.toLocaleTimeString()}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
