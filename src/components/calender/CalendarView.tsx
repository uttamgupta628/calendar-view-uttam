import React, { useState, useCallback } from 'react';
import { CalendarViewProps, CalendarEvent } from './CalendarView.types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { EventModal } from './EventModal';
import { formatDate } from '@/utils';

export const CalendarView: React.FC<CalendarViewProps> = ({
  events: initialEvents,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialView = 'month',
  initialDate = new Date(),
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<'month' | 'week'>(initialView);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [prefilledDate, setPrefilledDate] = useState<Date | undefined>();

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleDayClick = useCallback((date: Date) => {
    setPrefilledDate(date);
    setSelectedEvent(undefined);
    setModalOpen(true);
  }, []);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setPrefilledDate(undefined);
    setModalOpen(true);
  }, []);

  const handleTimeSlotClick = useCallback((date: Date, hour: number) => {
    const slotDate = new Date(date);
    slotDate.setHours(hour, 0, 0, 0);
    setPrefilledDate(slotDate);
    setSelectedEvent(undefined);
    setModalOpen(true);
  }, []);

  const handleSaveEvent = useCallback((event: CalendarEvent) => {
    if (selectedEvent) {
      onEventUpdate(event.id, event);
    } else {
      onEventAdd(event);
    }
  }, [selectedEvent, onEventAdd, onEventUpdate]);

  const handleDeleteEvent = useCallback(() => {
    if (selectedEvent) {
      onEventDelete(selectedEvent.id);
    }
  }, [selectedEvent, onEventDelete]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-neutral-900">
          {formatDate(currentDate)}
        </h1>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
          >
            Today
          </button>
          
          <button
            onClick={goToNextMonth}
            className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="h-6 w-px bg-neutral-300 mx-2" />

          <div className="flex bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                view === 'month' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                view === 'week' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      {view === 'month' ? (
        <MonthView
          currentDate={currentDate}
          events={initialEvents}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
        />
      ) : (
        <WeekView
          currentDate={currentDate}
          events={initialEvents}
          onTimeSlotClick={handleTimeSlotClick}
          onEventClick={handleEventClick}
        />
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(undefined);
          setPrefilledDate(undefined);
        }}
        onSave={handleSaveEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
        event={selectedEvent}
        prefilledDate={prefilledDate}
      />
    </div>
  );
};