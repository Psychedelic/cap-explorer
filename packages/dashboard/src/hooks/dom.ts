/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';

export const useOutsideHandler = ({
  domElement,
}: {
  domElement: HTMLDivElement | undefined,
}) => {
  const [datetime, setDatetime] = useState<string>();

  useEffect(() => {
    const clickOutsideHandler = (event: UIEvent) => {
      if (!domElement || !event?.composedPath) return;

      const outsideBoundaries = !event.composedPath().includes(domElement);

      if (outsideBoundaries) {
        setDatetime(new Date().toISOString());
      }
    };

    document.addEventListener('click', clickOutsideHandler);
    return () => document.removeEventListener('click', clickOutsideHandler);
  }, [domElement]);

  return datetime;
};
