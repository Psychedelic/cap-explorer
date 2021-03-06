import React from 'react';
import { styled } from '@stitched';

const Tooltip = styled('div', {
  backgroundColor: '#232323',
  border: '1px solid #5A5A5A',
  borderRadius: '10px',
  padding: '20px',
  fontFamily: 'Inter',
  fontWeight: 'normal',
  boxShadow: '1px 1px 40px rgba(0,0,0,0.6)',
  zIndex: 9999,
  position: 'absolute',
  top: '78px',
  left: 0,
  display: 'none',
  width: '85vw',

  '@lg': {
    maxWidth: '540px',
  },

  '& [data-arrow]': {
    position: 'absolute',
    top: '-8px',
    left: '17px',
    width: '20px',
    height: '20px',
    backgroundColor: '#232323',
    border: '1px solid #5A5A5A',
    transform: 'rotate(45deg)',

    '&:after': {
      content: '',
      width: '20px',
      height: '20px',
      backgroundColor: '#232323',
    },
  },

  '& [data-arrow-after]': {
    width: '30px',
    height: '16px',
    backgroundColor: '#232323',
    position: 'absolute',
    top: '1px',
    left: '12px',  
  },

  '& span': {
    display: 'block',
  },

  '& [data-title]': {
    color: '#fff',
    paddingBottom: '10px',
    fontWeight: 'normal',
  },

  '& [data-description]': {
    color: '#8D8E92',
    fontWeight: 'regular',
    lineHeight: 1.4,
    pointerEvents: 'none',

    '& a': {
      color: '$purple',
      transition: 'opacity 0.3s',
      cursor: 'pointer',
      pointerEvents: 'visible',

      '&:hover': {
        opacity: 0.8,
      },
    },
  },

  '& [data-hover-placeholder]': {
    background: 'transparent',
    width: '180px',
    height: '30px',
    position: 'absolute',
    top: '-25px',
    left: 0,
    pointerEvents: 'visible',
    zIndex: 0,
  },

  '& [data-pointer-events-none]': {
    pointerEvents: 'none'
  },

  '& [data-pointer-events]': {
    pointerEvents: 'auto'
  },
});

export const TableUnknownCellTooltip = () => {
  return (
    <Tooltip data-tooltip>
      <span data-hover-placeholder />
      <span data-arrow />
      <span data-arrow-after />
      <span data-title data-pointer-events-none>Why is this Unknown?</span>
      <span data-description data-pointer-events-none>
        This asset has not been added to DAB yet. The owner or controller of 
        this asset should add it to DAB so the name and other info about this 
        asset can be automatically surfaced in every interface that uses DAB. <a data-learn-more data-pointer-events href='https://dab.ooo' target='_blank'>Learn More.</a>
      </span>
    </Tooltip>
  );
}