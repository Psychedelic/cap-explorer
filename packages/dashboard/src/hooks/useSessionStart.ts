/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';

export function useSessionStart() {
  const [sessionStart] = useState(Date.now());

  const [seconds, setSeconds] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() - sessionStart ?? Date.now();
      const secs = Math.ceil(time / 1000);
      setSeconds(secs);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, sessionStart]);

  const minutes = Math.floor(seconds / 60);

  return seconds > 60 ? `${minutes}m` : `${seconds}s`;
}
