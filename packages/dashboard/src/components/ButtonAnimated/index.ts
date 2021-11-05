import { styled } from '@stitched';

export default styled('button', {
  transform: 'scale(1)',
  transition: 'transform 0.2s ease-in',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',

  '& svg': {
    transition: 'fill 0.3s',
  },

  '&:hover': {
    transform: 'scale(1.08)',

    '& svg': {
      fill: '$purple !important',
    },
  },

  variants: {
    disableAnimation: {
      true: {
        transition: 'none',

        '&:hover': {
          transform: 'none',
        },
      },
    },
  },
});
