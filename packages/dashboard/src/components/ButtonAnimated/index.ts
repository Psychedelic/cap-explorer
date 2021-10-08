import { styled } from '@stitched';

export default styled('button', {
  transform: 'scale(1)',
  transition: 'transform 0.2s ease-in',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',

  '&:hover': {
    transform: 'scale(1.08)',
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
