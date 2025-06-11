
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TimeEntry {
  id: string;
  employee_id: string;
  clock_in: string;
  clock_out?: string;
  total_hours?: number;
  date: string;
  created_at: string;
}

export const TimeTracking = () => {
  const { user, profile } = useAuth();
  const [isClocked, setIsClocked] = useState(false);
  const [currentSession, setCurrentSession] = useState<Date | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    loadTimeEntries();

    return () => clearInterval(timer);
  }, [user]);

  const loadTimeEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('employee_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setTimeEntries(data || []);
      
      // Check if there's an active session (no clock_out)
      const activeEntry = data?.find(entry => !entry.clock_out);
      if (activeEntry) {
        setIsClocked(true);
        setCurrentSession(new Date(activeEntry.clock_in));
      }
    } catch (error) {
      console.error('Error loading time entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    if (!user) return;
    
    try {
      const now = new Date();
      const { error } = await supabase
        .from('time_entries')
        .insert({
          employee_id: user.id,
          clock_in: now.toISOString(),
          date: now.toISOString().split('T')[0]
        });
      
      if (error) throw error;
      
      setIsClocked(true);
      setCurrentSession(now);
      loadTimeEntries();
    } catch (error) {
      console.error('Error clocking in:', error);
    }
  };

  const handleClockOut = async () => {
    if (!currentSession || !user) return;
    
    try {
      const now = new Date();
      const totalHours = (now.getTime() - currentSession.getTime()) / (1000 * 60 * 60);
      
      // Find the active entry to update
      const activeEntry = timeEntries.find(entry => !entry.clock_out);
      if (activeEntry) {
        const { error } = await supabase
          .from('time_entries')
          .update({
            clock_out: now.toISOString(),
            total_hours: Math.round(totalHours * 100) / 100
          })
          .eq('id', activeEntry.id);
        
        if (error) throw error;
        
        setIsClocked(false);
        setCurrentSession(null);
        loadTimeEntries();
      }
    } catch (error) {
      console.error('Error clocking out:', error);
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

  if (loading) {
    return (
      <div className="neo-card p-4 sm:p-6 rounded-3xl">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-neo-pink/10 to-neo-blue/10">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Time Tracking</h3>
      
      <div className="text-center mb-6">
        <div className="text-3xl font-bold mb-2">{currentTime.toLocaleTimeString()}</div>
        <div className="text-sm text-gray-600 mb-2">
          Welcome back, {profile?.first_name}!
        </div>
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
        {timeEntries.map((entry) => (
          <div key={entry.id} className="bg-white border-2 border-black p-2 rounded-xl text-sm">
            <div className="flex justify-between">
              <span>{new Date(entry.date).toLocaleDateString()}</span>
              {entry.total_hours && <span className="font-bold">{entry.total_hours}h</span>}
            </div>
            <div className="text-xs text-gray-600">
              In: {new Date(entry.clock_in).toLocaleTimeString()}
              {entry.clock_out && ` | Out: ${new Date(entry.clock_out).toLocaleTimeString()}`}
            </div>
          </div>
        ))}
        {timeEntries.length === 0 && (
          <p className="text-gray-500 text-center py-4">No time entries yet</p>
        )}
      </div>
    </div>
  );
};
