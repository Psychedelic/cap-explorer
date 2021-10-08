import React, { useEffect, useState } from 'react';
import { styled } from '@stitched';
import Identicon from '@components/Identicon';

const Container = styled('div', {
  fontFamily: 'Inter',
  fontWeight: 'bold',
  fontSize: '$l',
  display: 'flex',
  alignItems: 'center',
  height: '32px',

  '& button': {
    lineHeight: '$normal',

    '&:nth-child(2)': {
      '@initial': {
        maxWidth: 'calc(100% - 40px)',
      },

      '@lg': {
        maxWidth: 'none',
      },
    },
  },
});

const COPIED_TO_CLIPBOARD_TIMEOUT = 1800;
const COPIED_TO_CLIPBOARD_MESSAGE = 'Account id has been copied to clipboard!';

const Identity = ({ id }: { id: string }) => {
  const [copiedSuccessfully, setCopiedSuccessfully] = useState<string>('');
  // eslint-disable-next-line no-return-await
  // eslint-disable-next-line max-len
  const copyToClipboardHandler = (textToCopy: string) => {
    try {
      navigator.clipboard.writeText(textToCopy);
      setCopiedSuccessfully(COPIED_TO_CLIPBOARD_MESSAGE);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Oops! Failed to copy to clipboard.');
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopiedSuccessfully('');
    }, COPIED_TO_CLIPBOARD_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [copiedSuccessfully]);

  return (
    <Container>
      <Identicon />
      <button type="button" onClick={() => copyToClipboardHandler(id)}>
        { copiedSuccessfully || id }
      </button>
    </Container>
  );
};

export default Identity;
