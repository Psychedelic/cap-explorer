import React, { useEffect, useState } from 'react';
import { styled } from '@stitched';
import { useBookmarkPersistedState } from '@hooks/bookmarks';
import ButtonAnimated from '@components/ButtonAnimated';
import Icon from '@components/Icon';

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

const initialState: string[] = [];

const ButtonBookmark = ({ account }: { account: string }) => {
  const [savedAccounts, setSavedAccounts] = useBookmarkPersistedState(initialState);
  const [checkmark, setCheckmark] = useState<boolean>(false);

  useEffect(() => {
    // On mount, check if account is bookmarked
    const found = savedAccounts.find((currAcc) => account === currAcc);

    setCheckmark(!!found);
  }, [savedAccounts, account]);

  const bookmarkHandler = () => {
    if (savedAccounts.includes(account)) return;

    setSavedAccounts([
      ...savedAccounts,
      account,
    ]);
  };

  const currentIcon = checkmark ? 'Check' : 'Bookmark';
  const currentTitle = checkmark ? 'Account is saved' : 'Save the account';

  return (
    <Styled onClick={bookmarkHandler}>
      <Icon
        icon={currentIcon}
        size="sm"
        title={currentTitle}
      />
    </Styled>
  );
};

export default ButtonBookmark;
