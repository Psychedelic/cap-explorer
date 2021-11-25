import React, { useState } from 'react';
import { CanisterMetadata } from '@utils/dab';
import { styled } from '@stitched';
import iconUnknown from '@images/icon-unknown.svg';
import Loading from '@components/Loading';

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

const Hidden = styled('div', {
  width: 0,
  height: 0,
  position: 'absolute',
  zIndex: -9999,
  visibility: 'hidden',
});

const LoaderContainer = styled('div', {
  position: 'relative',
  width: '35px',
  height: '35px',
  marginRight: '10px',
});

export default ({
  cellValue,
  derivedId = true,
  identityInDab,
}: {
  cellValue?: number,
  derivedId?: boolean,
  identityInDab?: CanisterMetadata,
}) => {
  const [imgReady, setImgReady] = useState(false);

  return (
    <ItemCell>
      {
        !imgReady
        && (
          <LoaderContainer>
            <Loading size='s' alt='Loading' />
          </LoaderContainer>
        )
      }
      <span
        data-image
        style={{
          backgroundImage: `url(${identityInDab?.logo_url || iconUnknown})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          display: imgReady ? 'inline-block' : 'none'
        }}
      />
      <Hidden>
        <img src={identityInDab?.logo_url || iconUnknown} alt='' onLoad={() => setImgReady(true)} />
      </Hidden>
      {`${identityInDab?.name || 'Unknown'}${derivedId ? ' ' + '#' + cellValue : ''}`}
    </ItemCell>
  );
}