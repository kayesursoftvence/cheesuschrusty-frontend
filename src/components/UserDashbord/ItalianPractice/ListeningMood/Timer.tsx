import { useState, useEffect } from 'react';
import { Clock1 } from 'lucide-react';

interface TimerProps {
  isRunning?: boolean;
}

function Timer({ isRunning = true }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(function() {
    if (!isRunning) return;
    
    const interval = setInterval(function() {
      setSeconds(function(prev) {
        return prev + 1;
      });
    }, 1000);

    return function() {
      clearInterval(interval);
    };
  }, [isRunning]);

  function formatTime(totalSeconds: number) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className="flex items-center gap-2">
      <Clock1 size={18} className="text-gray-500 dark:text-gray-400" />
      <span className="font-mono font-bold text-gray-900 dark:text-white">
        {formatTime(seconds)}
      </span>
    </div>
  );
}

export default Timer;