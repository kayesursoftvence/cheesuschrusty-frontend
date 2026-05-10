import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { JSX } from "react";

type CountdownTimerProps = {
  hours?: number;
  minutes?: number;
  seconds?: number;
  isRunning?: boolean;
  onFinish?: () => void;
};

export default function CountdownTimer(props: CountdownTimerProps): JSX.Element {
  const hours = props.hours ?? 0;
  const minutes = props.minutes ?? 0;
  const seconds = props.seconds ?? 0;
  const isRunning = props.isRunning ?? true;
  const onFinish = props.onFinish;

  const totalSeconds: number = hours * 3600 + minutes * 60 + seconds;

  const [timeLeft, setTimeLeft] = useState<number>(totalSeconds);

  function formatTime(time: number): string {
    const h: number = Math.floor(time / 3600);
    const m: number = Math.floor((time % 3600) / 60);
    const s: number = time % 60;
    function pad(n: number): string {
      return String(n).padStart(2, "0");
    }
    if (h > 0) {
      return pad(h) + ":" + pad(m) + ":" + pad(s);
    }
    return pad(m) + ":" + pad(s);
  }

  useEffect(function () {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      if (onFinish) {
        onFinish();
      }
      return;
    }

    const interval: NodeJS.Timeout = setInterval(function () {
      setTimeLeft(function (prev) {
        return prev - 1;
      });
    }, 1000);

    return function () {
      clearInterval(interval);
    };
  }, [timeLeft, onFinish, isRunning]);

  return (
    <div className="flex items-center gap-4">
      <div className="bg-blue-600/20 border border-blue-400 text-white px-5 py-2.5 rounded-lg font-mono font-bold flex items-center gap-2">
        <FaPlay /> {formatTime(timeLeft)}
      </div>
    </div>
  );
}