import React from 'react';
import { styled, keyframes } from '@stitched';
import imgcapCircleLogoBw from '@images/cap-circle-logo-bw.svg';

const pulse = keyframes({
  '0%': { transform: 'scale(1)' },
  '60%': { transform: 'scale(1.1)' },
  '100%': { transform: 'scale(1)' },
});

const Container = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',

  '& img': {
    animation: `${pulse} 800ms linear infinite`,
    boxShadow: '1px 1px 60px rgb(255 255 255 / 8%)',
    borderRadius: '50%',
  },

  variants: {
    size: {
      s: {
        '& img': {
          width: 'auto',
          height: '20px',
        },
      },
      sm: {
        '& img': {
          width: 'auto',
          height: '40px',
        },
      },
      m: {
        '& img': {
          width: 'auto',
          height: '80px',
        },
      },
      l: {
        '& img': {
          width: 'auto',
          height: '160px',
        },
      },
    },
  },
});

export const RawLoading = ({
  alt,
}: {
 alt: string, 
}) => (
  <img
    src={imgcapCircleLogoBw}
    alt={alt}
  />
);

export default ({
  alt,
  size,
}: {
  alt: string,
  size: 's' | 'sm' | 'm' | 'l',
}) => (
  <Container
    size={size}
    data-id="loading"
  >
    <RawLoading alt={alt} />
  </Container>
);
