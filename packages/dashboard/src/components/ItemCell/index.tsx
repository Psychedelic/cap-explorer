import React from 'react';
import { CanisterMetadata } from '@utils/dab';
import { styled } from '@stitched';
import iconUnknown from '@images/icon-unknown.svg';

const ItemCell = styled('div', {
  display: 'flex',
  alignItems: 'center',

  '& [data-image]': {
    width: '35px',
    height: '35px',
    borderRadius: '6px',
    marginRight: '10px',
  },
});

export default ({
  cellValue,
  derivedId = true,
  identityInDab,
}: {
  cellValue?: number,
  derivedId?: boolean,
  identityInDab?: CanisterMetadata,
}) => (
  <ItemCell>
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

    { identityInDab?.name || 'Unknown' }
    {
      // If undefined, hide the cellValue
      derivedId
        ? cellValue ? ' #' + cellValue : ''
        : ''
    }
  </ItemCell>
);