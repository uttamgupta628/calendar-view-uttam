import React, { useState, useEffect } from 'react';
import { CalendarEvent } from './CalendarView.types';
import { Modal } from '@/components/primitives';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: () => void;
  event?: CalendarEvent;
  prefilledDate?: Date;
}

export const EventModal: React.FC<EventModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  event, 
  prefilledDate 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [color, setColor] = useState('#3b82f6');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStartDate(new Date(event.startDate));
      setEndDate(new Date(event.endDate));
      setColor(event.color || '#3b82f6');
      setCategory(event.category || '');
    } else if (prefilledDate) {
      setStartDate(prefilledDate);
      const end = new Date(prefilledDate);
      end.setHours(end.getHours() + 1);
      setEndDate(end);
    } else {
      setTitle('');
      setDescription('');
      setStartDate(new Date());
      const end = new Date();
      end.setHours(end.getHours() + 1);
      setEndDate(end);
      setColor('#3b82f6');
      setCategory('');
    }
    setErrors({});
  }, [event, prefilledDate, isOpen]);

  const colors = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Orange' },
    { value: '#ef4444', label: 'Red' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }
    
    if (description && description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }
    
    if (endDate < startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    onSave({
      id: event?.id || `evt-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      color,
      category: category.trim(),
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'Create Event'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Title <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Event title"
            maxLength={100}
            autoFocus
          />
          {errors.title && <p className="text-error-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Event description"
            rows={3}
            maxLength={500}
          />
          {errors.description && <p className="text-error-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={startDate.toISOString().slice(0, 16)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={endDate.toISOString().slice(0, 16)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.endDate && <p className="text-error-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Color
          </label>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-10 h-10 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  color === c.value ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : ''
                }`}
                style={{ backgroundColor: c.value }}
                aria-label={c.label}
                type="button"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Meeting, Work, Personal..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          {event && onDelete && (
            <button
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="px-4 py-2 bg-error-500 text-white rounded-lg hover:bg-error-600 transition-colors focus:outline-none focus:ring-2 focus:ring-error-500"
              type="button"
            >
              Delete
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            type="button"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};