/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import { useThrottledCallback } from 'use-debounce';

const isSmallerThanBreakpoint = (breakpoint: number) => (
  document.documentElement.clientWidth
  || document.body.clientWidth
  || window.innerWidth
) <= breakpoint;

const throttleMs = 400;

export const useWindowResize = ({
  breakpoint,
}: {
  breakpoint: number,
}) => {
  const [isSmallerThan, setIsSmallerThan] = useState(
    isSmallerThanBreakpoint(breakpoint),
  );
  const windowResizeHandler = useThrottledCallback(() => {
    const currentScreenState = isSmallerThanBreakpoint(breakpoint);
    const diff = isSmallerThan !== currentScreenState;

    if (diff) {
      setIsSmallerThan(currentScreenState);
    }
  }, throttleMs, { leading: true, trailing: true });

  useEffect(() => {
    window.addEventListener('resize', windowResizeHandler);
    return () => window.removeEventListener('resize', windowResizeHandler);
  }, [isSmallerThan, setIsSmallerThan]);

  return isSmallerThan;
};
