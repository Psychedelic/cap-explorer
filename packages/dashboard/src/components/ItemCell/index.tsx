import React from 'react';
import {
  CanisterMetadata,
  DAB_IDENTITY_UNKNOWN,
} from '@utils/dab';
import { styled } from '@stitched';
import iconUnknown from '@images/icon-unknown.svg';

const ItemCell = styled('div', {
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.3s',

  '& [data-image]': {
    width: '35px',
    height: '35px',
    borderRadius: '6px',
    marginRight: '10px',
  },

  variants: {
    asHoverState: {
      true: {
        '&:hover': {
          color: '$purple',
        },      
      }
    }
  },
});

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

    '& a': {
      color: '$purple',
      transition: 'opacity 0.3s',

      '&:hover': {
        opacity: 0.8,
      },
    },
  },
});

export default ({
  cellValue,
  derivedId = true,
  identityInDab,
  asHoverState = false,
}: {
  cellValue?: number,
  derivedId?: boolean,
  identityInDab?: CanisterMetadata,
  asHoverState?: boolean,
}) => (
  <ItemCell asHoverState={asHoverState}>
    <span
      data-image
      style={{
        backgroundImage: `url(${identityInDab?.logo_url || iconUnknown})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        display: 'inline-block',
      }}
    />

    <span data-identity-name>
      { identityInDab?.name || DAB_IDENTITY_UNKNOWN }
      {
        // If undefined, hide the cellValue
        derivedId
          ? cellValue ? ' #' + cellValue : ''
          : ''
      }
    </span>

    {
      !identityInDab?.name
      && (
        <Tooltip data-tooltip>
          <span data-arrow />
          <span data-arrow-after />
          <span data-title>Why is this Unknown?</span>
          <span data-description>
            This asset has not been added to DAB yet. The owner or controller of 
            this asset should add it to DAB so the name and other info about this 
            asset can be automatically surfaced in every interface that uses DAB. <a href='https://dab.ooo' target='_blank'>Learn More.</a>
          </span>
        </Tooltip>
      )
    }
  </ItemCell>
);