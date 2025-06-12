
import { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  event_type: string;
  related_id?: string;
  created_by?: string;
  created_at: string;
}

export const IntegratedCalendar = () => {
  const { profile } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    event_time: '',
    event_type: 'general'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          ...eventForm,
          created_by: profile?.first_name
        });

      if (error) throw error;
      setEventForm({
        title: '',
        description: '',
        event_date: new Date().toISOString().split('T')[0],
        event_time: '',
        event_type: 'general'
      });
      setShowAddEvent(false);
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'payout': return 'bg-green-500';
      case 'shift': return 'bg-blue-500';
      case 'delivery': return 'bg-orange-500';
      case 'pickup': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.event_date === date);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  if (loading) return <div className="text-center py-4">Loading calendar...</div>;

  return (
    <div className="neo-card p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-neo-blue/20 to-neo-purple/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Calendar</h3>
        <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
          <DialogTrigger asChild>
            <Button className="neo-button bg-neo-blue text-white">
              <Plus size={16} className="mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Calendar Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <Label htmlFor="event-title">Title</Label>
                <Input
                  id="event-title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-date">Date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={eventForm.event_date}
                    onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="event-time">Time</Label>
                  <Input
                    id="event-time"
                    type="time"
                    value={eventForm.event_time}
                    onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="event-type">Event Type</Label>
                <Select 
                  value={eventForm.event_type} 
                  onValueChange={(value) => setEventForm({ ...eventForm, event_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="payout">Consignment Payout</SelectItem>
                    <SelectItem value="shift">Employee Shift</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="pickup">Customer Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="neo-button bg-neo-purple text-white">
                Add Event
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-bold bg-gray-200 text-gray-700">
            {day}
          </div>
        ))}
        {generateCalendarDays().map((date, index) => {
          const dateString = date.toISOString().split('T')[0];
          const dayEvents = getEventsForDate(dateString);
          const isToday = date.toDateString() === new Date().toDateString();
          const isCurrentMonth = date.getMonth() === new Date().getMonth();
          
          return (
            <div
              key={index}
              className={`min-h-20 p-1 border border-gray-300 ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-100'
              } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`text-sm font-medium ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded text-white truncate ${getEventTypeColor(event.event_type)}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <div>
        <h4 className="font-bold text-lg mb-3">Upcoming Events</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto neo-scrollbar">
          {events
            .filter(event => new Date(event.event_date) >= new Date())
            .slice(0, 10)
            .map(event => (
              <div key={event.id} className="bg-white border-2 border-gray-300 p-3 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 ${getEventTypeColor(event.event_type)}`}></div>
                  <div className="flex-1">
                    <h5 className="font-bold">{event.title}</h5>
                    {event.description && (
                      <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon size={12} />
                        {new Date(event.event_date).toLocaleDateString()}
                      </span>
                      {event.event_time && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {event.event_time}
                        </span>
                      )}
                      <span className="capitalize">{event.event_type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
