import React from 'react';
import { copyToClipboard } from '@utils/clipboard';
import { trimAccount } from '@utils/account';
import { Principal } from '@dfinity/principal';
import { styled } from '@stitched';
import Fleekon from '@components/Fleekon';

const IdentityCellCopyContainer = styled('span', {
  cursor: 'copy',
  transition: 'opacity 0.2s',

  '&:hover': {
    opacity: 0.8,
  },

  '& .icon-clone': {
    paddingTop: '4px',
    paddingLeft: '4px',
  },
});

export default ({
  id,
}: {
  id: string,
}) => {
  const onClickHandler = () => {
    try {
      if (!(id === Principal.fromText(id).toString())) {
        throw Error('Oops! Not a valid principal, not copied to clipboard');
      }

      copyToClipboard(id)
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <IdentityCellCopyContainer onClick={onClickHandler}>
      {trimAccount(id)}
      <Fleekon
        icon='clone'
        className="icon-clone"
        size="16px"
      />
    </IdentityCellCopyContainer>
  );
}