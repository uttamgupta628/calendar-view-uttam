import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from './CalendarView.types';
import { useState } from 'react';

const meta: Meta<typeof CalendarView> = {
  title: 'Components/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CalendarView>;

// Sample events
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

// Generate many events for testing
const generateManyEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const titles = ['Meeting', 'Call', 'Review', 'Planning', 'Workshop', 'Training', 'Presentation'];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  for (let i = 0; i < 30; i++) {
    const day = Math.floor(Math.random() * 28) + 1;
    const hour = Math.floor(Math.random() * 16) + 8;
    const duration = Math.random() > 0.5 ? 1 : 2;
    
    events.push({
      id: `evt-${i}`,
      title: `${titles[Math.floor(Math.random() * titles.length)]} ${i + 1}`,
      description: 'Auto-generated event for testing',
      startDate: new Date(2025, 10, day, hour, 0),
      endDate: new Date(2025, 10, day, hour + duration, 0),
      color: colors[Math.floor(Math.random() * colors.length)],
      category: 'Generated',
    });
  }
  
  return events;
};

// Interactive wrapper
const InteractiveCalendar = ({ initialEvents }: { initialEvents: CalendarEvent[] }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const handleEventUpdate = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updates } : event
      )
    );
  };

  const handleEventDelete = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  return (
    <CalendarView
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  );
};

// Stories
export const Default: Story = {
  render: () => <InteractiveCalendar initialEvents={sampleEvents} />,
};

export const EmptyState: Story = {
  render: () => <InteractiveCalendar initialEvents={[]} />,
};

export const WeekView: Story = {
  render: () => <InteractiveCalendar initialEvents={sampleEvents} />,
  args: {
    initialView: 'week',
  },
};

export const WithManyEvents: Story = {
  render: () => <InteractiveCalendar initialEvents={generateManyEvents()} />,
};

export const InteractiveDemo: Story = {
  render: () => <InteractiveCalendar initialEvents={sampleEvents} />,
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive calendar with event management. Try clicking on days to create events, or click existing events to edit them.',
      },
    },
  },
};