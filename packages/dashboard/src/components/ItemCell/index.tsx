import React from 'react';
import {
  CanisterMetadata,
  DAB_IDENTITY_UNKNOWN,
} from '@utils/dab';
import { styled } from '@stitched';
import iconUnknown from '@images/icon-unknown.svg';
import { TableUnknownCellTooltip } from '@components/Tooltips'
import { NFTDetails } from '@psychedelic/dab-js';
import Loading from '@components/Loading';

const ItemCell = styled('div', {
  '& [data-cta]': {
    cursor: 'pointer',

    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.3s',
  
    '& [data-image]': {
      width: '35px',
      height: '35px',
      borderRadius: '6px',
      marginRight: '10px',
      position: 'relative',
    },
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
  nftDetails,
  isLoadingDabItemDetails = false,
}: {
  cellValue?: number,
  derivedId?: boolean,
  identityInDab?: CanisterMetadata,
  asHoverState?: boolean,
  nftDetails?: NFTDetails,
  isLoadingDabItemDetails?: boolean,
}) => (
  <ItemCell data-dab-identity-cell asHoverState={asHoverState}>
    <div data-cta>
      {
        isLoadingDabItemDetails
        ? (
          <span data-image>
            <Loading size='s' alt='Loading' />
          </span>
        )
        : (
          <span
            data-image
            style={{
              backgroundImage: `url(${nftDetails?.url || identityInDab?.logo_url || iconUnknown})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              display: 'inline-block',
            }}
          />
        )
      }

      <span data-identity-name>
        { identityInDab?.name || DAB_IDENTITY_UNKNOWN }
        {
          // If undefined, hide the cellValue
          derivedId
            ? cellValue ? ' #' + cellValue : ''
            : ''
        }
      </span>
    </div>

    {
      !identityInDab?.name
      && (
        <TableUnknownCellTooltip />
      )
    }
  </ItemCell>
);