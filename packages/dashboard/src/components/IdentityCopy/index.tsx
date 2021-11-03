import React, { useEffect, useState } from 'react';
import { styled } from '@stitched';
import { useBookmarkPersistedState } from '@hooks/bookmarks';
import ButtonAnimated from '@components/ButtonAnimated';
import Icon from '@components/Icon';
import { trimAccount } from '@utils/account';

const Styled = styled(ButtonAnimated, {
  width: '45px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$darkGrey',
  borderRadius: '$ctaRadius',
  cursor: 'pointer',

  '& img': {
    width: 'auto',
    height: '20px',
  },
});

const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

const Account = styled('span', {
  marginRight: '10px',
});

const ICON_RESET_TIMEOUT = 5000;

const ButtonBookmark = ({ account }: { account: string }) => {
  const [checkmark, setCheckmark] = useState<boolean>(false);

  const currentIcon = checkmark ? 'Check' : 'Clone';
  const currentTitle = checkmark ? 'Principal Id is saved' : 'Save the Principal Id';

  // eslint-disable-next-line no-return-await
  // eslint-disable-next-line max-len
  const copyToClipboardHandler = (textToCopy: string) => {
    try {
      navigator.clipboard.writeText(textToCopy);

      setCheckmark(true);

      // reset icon state
      setTimeout(() => {
        setCheckmark(false);
      }, ICON_RESET_TIMEOUT);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Oops! Failed to copy to clipboard.');
    }
  };

  return (
    <Container>
      <Account>{account}</Account>
      <Styled onClick={() => copyToClipboardHandler(account)}>
        <Icon
          icon={currentIcon}
          size="sm"
          title={currentTitle}
        />
      </Styled>
    </Container>
  );
};

export default ButtonBookmark;
