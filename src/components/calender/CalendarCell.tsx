import  { memo } from 'react';
import { CalendarEvent } from './CalendarView.types';
import { formatTime } from '@/utils';

interface CalendarCellProps {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const CalendarCell = memo<CalendarCellProps>(({ 
  date, 
  events, 
  isToday, 
  isCurrentMonth, 
  onClick, 
  onEventClick 
}) => {
  const dayNumber = date.getDate();
  
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. ${events.length} events.`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`border border-neutral-200 h-28 p-2 hover:bg-neutral-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10 ${
        !isCurrentMonth ? 'bg-neutral-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        {isToday ? (
          <span className="w-7 h-7 bg-primary-500 rounded-full text-white text-sm flex items-center justify-center font-medium">
            {dayNumber}
          </span>
        ) : (
          <span className={`text-sm font-medium ${isCurrentMonth ? 'text-neutral-900' : 'text-neutral-400'}`}>
            {dayNumber}
          </span>
        )}
      </div>
      <div className="space-y-1 overflow-hidden">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onEventClick(event);
              }
            }}
            className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
            style={{ backgroundColor: event.color, color: 'white' }}
            role="button"
            tabIndex={0}
            aria-label={`${event.title}. ${formatTime(new Date(event.startDate))}`}
          >
            {event.title}
          </div>
        ))}
        {events.length > 3 && (
          <button className="text-xs text-primary-600 hover:underline">
            +{events.length - 3} more
          </button>
        )}
      </div>
    </div>
  );
});

CalendarCell.displayName = 'CalendarCell';