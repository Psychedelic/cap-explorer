import { styled } from '@stitched';

export const Title = styled('h1', {
  fontFamily: 'Inter',
  fontWeight: 600,
  fontStyle: 'normal',
  lineHeight: 1,
  color: 'inherit',
  textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',

  variants: {
    size: {
      xl: {
        fontSize: '$xl',
      },

      ml: {
        color: 'inherit',
        fontSize: '$ml',
      },
    },
  },
});

export default Title;
