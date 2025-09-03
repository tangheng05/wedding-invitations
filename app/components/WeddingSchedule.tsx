'use client';

import { useState } from 'react';

interface ScheduleEvent {
  time: string;
  title: string;
  description: string;
  icon?: string;
}

interface WeddingScheduleProps {
  events?: ScheduleEvent[];
  scheduleEvents?: {
    date1: ScheduleEvent[];
    date2: ScheduleEvent[];
  };
  weddingDate1?: string;
  weddingDate2?: string;
}

const defaultEvents: ScheduleEvent[] = [
  {
    time: "6:30 AM",
    title: "Guest Gathering",
    description: "Meet and greet with all honored guests to prepare for the procession",
    icon: "👥"
  },
  {
    time: "7:00 AM", 
    title: "Procession Ceremony",
    description: "Traditional wedding procession begins",
    icon: "💒"
  },
  {
    time: "8:00 AM",
    title: "Ceremony",
    description: "Wedding ceremony and vows exchange",
    icon: "💍"
  },
  {
    time: "9:00 AM",
    title: "Reception",
    description: "Celebration with family and friends",
    icon: "🎉"
  }
];

export default function WeddingSchedule({ events, scheduleEvents, weddingDate1, weddingDate2 }: WeddingScheduleProps) {
  const [selectedDate, setSelectedDate] = useState('date1');
  
  // Get events for the selected date
  const getDisplayEvents = () => {
    if (scheduleEvents) {
      const dateEvents = selectedDate === 'date1' ? scheduleEvents.date1 : scheduleEvents.date2;
      return dateEvents || [];
    }
    return events || defaultEvents;
  };
  
  const displayEvents = getDisplayEvents();

  return (
    <div className="text-center">
      <h3 className="text-2xl font-serif text-amber-100 mb-6">Wedding Day Schedule</h3>
      
      {/* Date Selection Bar */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-700/50 rounded-full p-1 border border-amber-300/30 flex">
          <button 
            onClick={() => setSelectedDate('date1')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selectedDate === 'date1' 
                ? 'bg-amber-500 text-slate-900' 
                : 'text-amber-200/70 hover:text-amber-200'
            }`}
          >
            {weddingDate1 || 'First Date'}
          </button>
          <button 
            onClick={() => setSelectedDate('date2')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selectedDate === 'date2' 
                ? 'bg-amber-500 text-slate-900' 
                : 'text-amber-200/70 hover:text-amber-200'
            }`}
          >
            {weddingDate2 || 'Second Date'}
          </button>
        </div>
      </div>

      {/* Morning Program Header */}
      <div className="mb-8">
        <h4 className="text-xl font-serif text-amber-100 mb-2">Morning Program</h4>
        <div className="flex justify-center">
          <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Schedule Events */}
      <div className="max-w-2xl mx-auto">
        <div className="space-y-8">
          {(displayEvents || []).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-amber-200/70 text-lg">No events scheduled for {selectedDate === 'date1' ? (weddingDate1 || 'First Date') : (weddingDate2 || 'Second Date')}</p>
              <p className="text-amber-200/50 text-sm mt-2">Events will appear here once they are added by the administrator.</p>
            </div>
          ) : (
            (displayEvents || []).map((event, index) => (
            <div key={index} className="relative">
              {/* Timeline connector */}
              {index < (displayEvents || []).length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-12 bg-amber-300/30"></div>
              )}
              
              <div className="flex items-start space-x-4">
                {/* Time */}
                <div className="flex-shrink-0 w-16 text-right">
                  <p className="text-amber-200 font-semibold text-sm">{event.time}</p>
                </div>
                
                {/* Icon */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-300/40 flex items-center justify-center">
                  <span className="text-sm">{event.icon}</span>
                </div>
                
                {/* Event Details */}
                <div className="flex-1 text-left">
                  <h5 className="text-amber-100 font-semibold text-sm mb-1">{event.title}</h5>
                  <p className="text-amber-200/70 text-xs leading-relaxed">{event.description}</p>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="mt-8 flex justify-center space-x-4">
        <div className="w-2 h-2 rounded-full bg-amber-300/40"></div>
        <div className="w-2 h-2 rounded-full bg-amber-300/60"></div>
        <div className="w-2 h-2 rounded-full bg-amber-300/40"></div>
      </div>
    </div>
  );
}
