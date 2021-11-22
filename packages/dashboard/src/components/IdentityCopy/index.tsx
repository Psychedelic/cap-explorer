import React, { useState } from 'react';
import { styled } from '@stitched';
import ButtonAnimated from '@components/ButtonAnimated';
import Fleekon from '@components/Fleekon';
import { copyToClipboard } from '@utils/clipboard';

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

export const ICON_RESET_TIMEOUT = 5000;

const ButtonBookmark = ({ account }: { account: string }) => {
  const [checkmark, setCheckmark] = useState<boolean>(false);

  const currentIcon = checkmark ? 'check' : 'clone';
  const currentTitle = checkmark ? 'Principal Id is saved' : 'Save the Principal Id';

  // eslint-disable-next-line no-return-await
  // eslint-disable-next-line max-len
  const copyToClipboardHandler = (textToCopy: string) => {
    try {
      copyToClipboard(textToCopy);

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
        <Fleekon
          icon={currentIcon}
          className="icon-clone"
          size="16px"
        />
      </Styled>
    </Container>
  );
};

export default ButtonBookmark;
