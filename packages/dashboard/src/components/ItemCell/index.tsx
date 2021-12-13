import React from 'react';
import {
  CanisterMetadata,
  DAB_IDENTITY_UNKNOWN,
  DABCollectionItem,
} from '@utils/dab';
import { styled } from '@stitched';
import iconUnknown from '@images/icon-unknown.svg';
import { TableUnknownCellTooltip } from '@components/Tooltips'
import { NFTDetails } from '@psychedelic/dab-js';
import Loading from '@components/Loading';
import { useHistory } from 'react-router-dom';
import { getRouteByName, RouteName } from '@utils/routes';

const ItemCell = styled('div', {
  '& [data-cta]': {
    cursor: 'pointer',
    paddingRight: '20px',

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

  '& [data-icon-video]': {
    marginRight: '10px',
    width: '35px',
    height: '35px',
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

const IconDisplayer = ({
  mediaUrl,
}: {
  mediaUrl?: string,
}) => {
  const isValidImgIcon = mediaUrl?.match(/.gif|.png|.jpg/);
  const isValidMediaIcon = mediaUrl?.match(/.mp4/);

  if (isValidMediaIcon) {
    return (
      <video data-icon-video controls width="35" loop autoPlay>
        <source src={mediaUrl} type="video/mp4" />
      </video>
    )
  }

  return (
    <span
      data-image
      style={{
        backgroundImage: `url(${isValidImgIcon ? mediaUrl : iconUnknown})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        display: 'inline-block',
      }}
    />
  );
}

export default ({
  cellValue,
  derivedId = true,
  metadata,
  asHoverState = false,
  nftDetails,
  isLoadingDabItemDetails = false,
}: {
  cellValue?: number,
  derivedId?: boolean,
  metadata?: DABCollectionItem,
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
          <IconDisplayer
          mediaUrl={nftDetails?.url || metadata?.icon}
          />
        )
      }

      <span data-identity-name>
        { metadata?.name || DAB_IDENTITY_UNKNOWN }
        {
          // If undefined, hide the cellValue
          derivedId
            ? cellValue ? ' #' + cellValue : ''
            : ''
        }
      </span>
    </div>

    {
      !metadata?.name
      && (
        <TableUnknownCellTooltip />
      )
    }
  </ItemCell>
);

export const UnknownItemCell = ({
  contractId,
  children,
  routeName,
}: {
  contractId: string,
  children: React.ReactNode,
  routeName: RouteName,
}) => {
  const history = useHistory();

  const getRouteByNameHandler = () => 
    routeName === 'AppTransactions'
      ? getRouteByName('AppTransactions', { id: contractId })
      : ''
  

  return (
    <span onClick={(e) => {
      if ((e.target as HTMLInputElement).getAttribute('data-tooltip')) {
        return;
      }

      if (!(e.target as HTMLInputElement).getAttribute('data-learn-more')) {
        history.push(
          getRouteByNameHandler()
        );
        return;
      }
    }}>
      { children }
    </span>
  );
};