import React from 'react';
import { styled } from '@stitched';
import { trimAccount } from '@utils/account';
import { useBookmarkPersistedState } from '@hooks/bookmarks';
import ButtonAnimated from '@components/ButtonAnimated';
import Icon from '@components/Icon';

const SavedContainer = styled('div', {
  display: 'grid',
  gridAutoRows: 'auto',
  rowGap: '12px',
  marginTop: '10px',

  '& > div': {
    width: '100%',
    display: 'flex',
    padding: '0px',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  '& svg': {
    width: '16px',
    fontSize: '$m',
  },

  '& button': {
    '&:first-child': {
      padding: '8px 12px',
      fontSize: '0.825rem',
      fontWeight: 600,
      borderRadius: '12px',
      cursor: 'pointer',
      border: '1px solid transparent',
      outline: 'none',
      backgroundColor: 'rgb(44, 47, 54)',
      whiteSpace: 'nowrap',
      opacity: 1,
      transition: 'opacity 0.3s',

      '&:hover': {
        opacity: 0.7,
      },
    },
  },
});

const Empty = styled('span', {
  fontSize: '$s',
  color: '$midGrey',
});

const SavedItem = ({
  account,
  removeHandler,
}: {
  account: string,
  removeHandler: (account: string) => void,
}) => (
  <div>
    <button
      type="button"
      aria-label="Saved account"
      data-saved-acc-id={account}
      onClick={() => console.log('TODO: on saved account link')}
    >
      {trimAccount(account)}
    </button>
    <ButtonAnimated
      type="button"
      aria-label="Remove account"
      onClick={() => removeHandler(account)}
    >
      <Icon
        icon="Times"
        size="sm"
        title="Remove from saved accounts"
      />
    </ButtonAnimated>
  </div>
);

const initialState: string[] = [];

const SavedAccounts = () => {
  const [savedAccounts, setSavedAccounts] = useBookmarkPersistedState(initialState);

  const removeHandler = (account: string) => {
    const filtered = savedAccounts?.filter((currentAccount: string) => account !== currentAccount);

    setSavedAccounts(filtered);
  };

  return (
    <div data-id="saved-accounts">
      <SavedContainer>
        <p>Accounts</p>
        {
          (
            savedAccounts.length > 0
            && savedAccounts.map((account: string) => (
              <SavedItem
                key={account}
                account={account}
                removeHandler={removeHandler}
              />
            ))
          )
          || <Empty>No pinned ids</Empty>
        }
      </SavedContainer>
    </div>
  );
};

export default SavedAccounts;
