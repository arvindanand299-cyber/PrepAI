'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Clock3, AlertTriangle } from 'lucide-react';

interface TimerProps {
  duration: 10 | 20 | 30;
  onTimeUp?: () => void;
}

export function Timer({ duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const isLowTime = timeLeft <= 60;
  const isCriticalTime = timeLeft <= 30;

  return (
    <Card
      className={`fixed bottom-5 right-5 z-50 overflow-hidden rounded-2xl border px-5 py-3 shadow-xl backdrop-blur-xl transition-all duration-300 ${
        isCriticalTime
          ? 'border-red-200 bg-red-50/95 shadow-red-100'
          : isLowTime
          ? 'border-amber-200 bg-amber-50/95 shadow-amber-100'
          : 'border-indigo-100 bg-white/95 shadow-indigo-100'
      }`}
    >
      {/* Top accent */}
      <div
        className={`absolute left-0 right-0 top-0 h-1 ${
          isCriticalTime
            ? 'bg-gradient-to-r from-red-500 to-rose-500'
            : isLowTime
            ? 'bg-gradient-to-r from-amber-400 to-orange-500'
            : 'bg-gradient-to-r from-indigo-500 to-purple-500'
        }`}
      />

      <div className="flex items-center gap-4 pt-1">
        {/* Icon */}
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isCriticalTime
              ? 'bg-red-100 text-red-600'
              : isLowTime
              ? 'bg-amber-100 text-amber-600'
              : 'bg-indigo-50 text-indigo-600'
          }`}
        >
          {isCriticalTime ? (
            <AlertTriangle className="h-5 w-5" />
          ) : (
            <Clock3 className="h-5 w-5" />
          )}
        </div>

        <div>
          <div
            className={`mb-0.5 text-xs font-semibold ${
              isCriticalTime
                ? 'text-red-600'
                : isLowTime
                ? 'text-amber-600'
                : 'text-slate-500'
            }`}
          >
            {isCriticalTime
              ? 'Time Almost Up'
              : isLowTime
              ? 'Time Running Low'
              : 'Time Remaining'}
          </div>

          <div
            className={`font-mono text-2xl font-bold leading-none tabular-nums ${
              isCriticalTime
                ? 'text-red-700'
                : isLowTime
                ? 'text-amber-700'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    </Card>
  );
}