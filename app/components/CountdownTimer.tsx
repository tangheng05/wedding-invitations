'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface CountdownTimerProps {
  weddingDate: Date | null;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ weddingDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!weddingDate) {
      return;
    }
    
    const calculateTimeLeft = () => {
      const difference = weddingDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      } else {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [weddingDate]);

  if (!weddingDate) {
    return (
      <div className="text-center">
        <h3 className="text-2xl font-serif text-gray-800 mb-4">Save the Date</h3>
        <p className="text-gray-600">Wedding date coming soon!</p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h3 className="text-2xl font-serif text-gray-800 mb-6">Countdown to Our Special Day</h3>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((item) => (
          <div key={item.label} className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-4 border border-pink-200">
            <div className="text-3xl font-bold text-gray-800 mb-1">{item.value}</div>
            <div className="text-gray-600 text-sm">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
