import React, {
  useEffect,
  useState,
} from 'react';
import Loading from '@components/Loading';
import { styled } from '@stitched';

const LoadingTransitionCtrlr = styled('div', {
  transition: 'opacity 0.3s',
  opacity: 0,

  variants: {
    show: {
      true: {
        opacity: 1,
      },
    }
  },
});

export const LoadableLoadingPlaceholder = ({
  alt
}: {
  alt: string,
}) => {
  // The loader is only displayed for network speeds
  // which are slow or take longer the X to load...
  const AWAIT_TIMEOUT_UNTIL_LOAD_MS = 1200;
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeoutRef = setTimeout(() => {
      setShow(true)
    }, AWAIT_TIMEOUT_UNTIL_LOAD_MS);

    return () => clearTimeout(timeoutRef)
  }, []);

  return (
    <LoadingTransitionCtrlr show={show}>
      <Loading alt={alt} size="m" />
    </LoadingTransitionCtrlr>
  )
}