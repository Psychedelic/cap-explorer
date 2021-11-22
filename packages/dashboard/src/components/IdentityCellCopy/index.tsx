import React, { useState } from 'react';
import { copyToClipboard } from '@utils/clipboard';
import { trimAccount } from '@utils/account';
import { Principal } from '@dfinity/principal';
import { styled } from '@stitched';
import Fleekon from '@components/Fleekon';
import { ICON_RESET_TIMEOUT } from '@components/IdentityCopy';

const IdentityCellCopyContainer = styled('span', {
  cursor: 'pointer',
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
  const [checkmark, setCheckmark] = useState<boolean>(false);
  const currentIcon = checkmark ? 'check' : 'clone';

  const onClickHandler = () => {
    try {
      if (!(id === Principal.fromText(id).toString())) {
        throw Error('Oops! Not a valid principal, not copied to clipboard');
      }

      setCheckmark(true);

      copyToClipboard(id)

      // reset icon state
      setTimeout(() => {
        setCheckmark(false);
      }, ICON_RESET_TIMEOUT);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <IdentityCellCopyContainer onClick={onClickHandler}>
      {trimAccount(id)}
      <Fleekon
        icon={currentIcon}
        className="icon-clone"
        size="16px"
      />
    </IdentityCellCopyContainer>
  );
}