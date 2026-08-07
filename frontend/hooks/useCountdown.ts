import { useState, useEffect } from 'react';

/**
 * Reusable hook placeholder for countdown timer formatting
 */
export function useCountdown(initialSeconds = 45) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = (newSeconds = initialSeconds) => {
    setIsActive(false);
    setSeconds(newSeconds);
  };

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return {
    seconds,
    formattedTime,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer,
  };
}
