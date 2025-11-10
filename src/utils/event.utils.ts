import { CalendarEvent } from '@/components/calender/CalendarView.types';

/**
 * Gets all events that occur on a specific date
 */
export const getEventsForDay = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    
    return (eventStart <= dayEnd && eventEnd >= dayStart);
  });
};

/**
 * Sorts events by start date
 */
export const sortEventsByDate = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });
};

/**
 * Checks if an event spans multiple days
 */
export const isMultiDayEvent = (event: CalendarEvent): boolean => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  
  return start.getDate() !== end.getDate() ||
         start.getMonth() !== end.getMonth() ||
         start.getFullYear() !== end.getFullYear();
};

/**
 * Validates event data
 */
export const validateEvent = (event: Partial<CalendarEvent>): string[] => {
  const errors: string[] = [];
  
  if (!event.title || event.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (event.title && event.title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }
  
  if (event.description && event.description.length > 500) {
    errors.push('Description must be 500 characters or less');
  }
  
  if (event.startDate && event.endDate && event.endDate < event.startDate) {
    errors.push('End date must be after start date');
  }
  
  return errors;
};