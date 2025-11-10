import React, { useMemo } from 'react';
import { CalendarEvent } from './CalendarView.types';
import { getWeekDays, isSameDay } from '@/utils';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ 
  currentDate, 
  events, 
  onTimeSlotClick, 
  onEventClick 
}) => {
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const today = useMemo(() => new Date(), []);

  return (
    <div className="bg-white rounded-lg shadow-card overflow-auto max-h-[600px]">
      <div className="grid grid-cols-8 sticky top-0 bg-white z-10 border-b border-neutral-200">
        <div className="p-3 text-sm font-semibold text-neutral-700 border-r border-neutral-200">Time</div>
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={`p-3 text-center border-r border-neutral-200 last:border-r-0 ${
              isSameDay(day, today) ? 'bg-primary-50' : ''
            }`}
          >
            <div className="text-xs text-neutral-600">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-semibold ${
              isSameDay(day, today) ? 'text-primary-600' : 'text-neutral-900'
            }`}>
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-8">
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="p-2 text-xs text-neutral-600 border-r border-b border-neutral-200 text-right">
              {hour.toString().padStart(2, '0')}:00
            </div>
            {weekDays.map((day, dayIndex) => {
              const slotEvents = events.filter(event => {
                const eventStart = new Date(event.startDate);
                return isSameDay(eventStart, day) && eventStart.getHours() === hour;
              });

              return (
                <div
                  key={dayIndex}
                  onClick={() => onTimeSlotClick(day, hour)}
                  className="relative h-16 border-r border-b border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer last:border-r-0"
                >
                  {slotEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className="absolute inset-x-1 top-1 text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: event.color, color: 'white' }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-[10px] opacity-90">
                        {new Date(event.startDate).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};