import React from 'react';
import {
  CanisterMetadata,
  DAB_IDENTITY_UNKNOWN,
} from '@utils/dab';
import { styled } from '@stitched';
import iconUnknown from '@images/icon-unknown.svg';
import { TableUnknownCellTooltip } from '@components/Tooltips'

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
          '& [data-identity-name]': {
            color: '$purple',
          },
        },
      }
    }
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
        <TableUnknownCellTooltip />
      )
    }
  </ItemCell>
);