import React, { useMemo } from 'react';
import { CalendarEvent } from './CalendarView.types';
import { CalendarCell } from './CalendarCell';
import { getCalendarGrid, isSameDay, getEventsForDay } from '@/utils';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({ 
  currentDate, 
  events, 
  onDayClick, 
  onEventClick 
}) => {
  const grid = useMemo(() => getCalendarGrid(currentDate), [currentDate]);
  const today = useMemo(() => new Date(), []);
  const currentMonth = currentDate.getMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="grid grid-cols-7 bg-neutral-100 border-b border-neutral-200">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-sm font-semibold text-neutral-700">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {grid.map((date, index) => {
          const dayEvents = getEventsForDay(events, date);
          return (
            <CalendarCell
              key={index}
              date={date}
              events={dayEvents}
              isToday={isSameDay(date, today)}
              isCurrentMonth={date.getMonth() === currentMonth}
              onClick={() => onDayClick(date)}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
};