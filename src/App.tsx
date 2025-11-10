import { useState, useCallback } from 'react';
import { CalendarView } from './components/calender';
import { CalendarEvent } from './components/calender/CalendarView.types';

const sampleEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Team Standup',
    description: 'Daily sync with the team',
    startDate: new Date(2025, 10, 11, 9, 0),
    endDate: new Date(2025, 10, 11, 9, 30),
    color: '#3b82f6',
    category: 'Meeting',
  },
  {
    id: 'evt-2',
    title: 'Design Review',
    description: 'Review new component designs',
    startDate: new Date(2025, 10, 11, 14, 0),
    endDate: new Date(2025, 10, 11, 15, 30),
    color: '#10b981',
    category: 'Design',
  },
  {
    id: 'evt-3',
    title: 'Client Presentation',
    startDate: new Date(2025, 10, 12, 10, 0),
    endDate: new Date(2025, 10, 12, 11, 30),
    color: '#f59e0b',
    category: 'Meeting',
  },
  {
    id: 'evt-4',
    title: 'Development Sprint',
    description: 'Sprint planning and task assignment',
    startDate: new Date(2025, 10, 13, 9, 0),
    endDate: new Date(2025, 10, 13, 17, 0),
    color: '#8b5cf6',
    category: 'Work',
  },
  {
    id: 'evt-5',
    title: 'Lunch Break',
    startDate: new Date(2025, 10, 10, 12, 0),
    endDate: new Date(2025, 10, 10, 13, 0),
    color: '#ec4899',
    category: 'Personal',
  },
];

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);

  const handleEventAdd = useCallback((event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  }, []);

  const handleEventUpdate = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updates } : event
      )
    );
  }, []);

  const handleEventDelete = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <CalendarView
        events={events}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    </div>
  );
}

export default App;