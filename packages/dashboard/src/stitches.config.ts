import { createStitches } from '@stitches/react';

export const BREAKPOINT_LG = 1024;
export const BREAKPOINT_DATA_TABLE_S = 440;
export const BREAKPOINT_DATA_TABLE_M = 768;
export const BREAKPOINT_DATA_TABLE_L = 1280;

export const {
  styled,
  css,
  globalCss,
  keyframes,
  theme,
} = createStitches({
  theme: {
    colors: {
      defaultTxtColour: '#FFFFFF',
      borderGrey: '#40444f',
      gradientDarkModeLighter: 'linear-gradient(180deg, #313131 0%, #040405 100%)',
      gradientDarkModeDarker: 'linear-gradient(180deg, #2B2B2B 0%, #000000 100%)',
      darkGrey: '#3A3A3A',
      midGrey: '#8D8E92',
      containerDarkModeGradient: 'linear-gradient(0deg, #181819, #292929)',
      borderDarkModeGradient: 'linear-gradient(174.51deg, rgba(163, 164, 167, 10.05) 4.38%, rgba(217, 218, 220, 10.05) 12.95%, rgba(145, 146, 152, 10.05) 24.37%, rgba(184, 185, 189, 10.05) 42.93%, rgba(255, 255, 255, 10.05) 54.83%, rgba(192, 192, 199, 10.05) 67.2%, rgba(144, 145, 149, 10.05) 83.86%, rgba(188, 191, 198, 10.05) 95.76%)',
      yellowBrand: '#F9DA3E',
      greyBrand: '#E3E4EB',
      primaryBlue: '#2172e5',
    },
    space: {
      sideBarMargin: '24px',
      menuItemSpacing: '20px',
      contentSectionSpacing: '40px',
      tableColumnSpacing: '40px',
      pageItemSpacing: '30px',
    },
    radii: {
      ctaRadius: '20px',
    },
    lineHeights: {
      normal: '1.4',
    },
    fontSizes: {
      s: '14px',
      m: '16px',
      ml: '18px',
      l: '22px',
      xl: '24px',
    },
  },
  media: {
    lg: `screen and (min-width: ${BREAKPOINT_LG}px)`,
    dataTableBreakPointS: `screen and (min-width: ${BREAKPOINT_DATA_TABLE_S}px)`,
    dataTableBreakPointM: `screen and (min-width: ${BREAKPOINT_DATA_TABLE_M}px)`,
    dataTableBreakPointL: `screen and (min-width: ${BREAKPOINT_DATA_TABLE_L}px)`,
  },
  utils: {},
  prefix: '',
});
