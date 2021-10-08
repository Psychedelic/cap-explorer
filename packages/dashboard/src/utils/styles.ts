import { globalCss } from '@stitched';

export default {};

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    border: 0,
    fontFamily: 'Inter',
    fontSize: '100%',
    font: 'inherit',
    verticalAlign: 'baseline',
    color: '$defaultTxtColour',
    boxSizing: 'border-box',
    lineHeight: 1,
  },
  'html, body': {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  a: {
    textDecoration: 'none',
  },
  ul: {
    listStyle: 'none',
  },
  button: {
    background: 'none',
    cursor: 'pointer',
  },
});
