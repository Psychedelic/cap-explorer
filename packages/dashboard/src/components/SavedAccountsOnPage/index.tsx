import React from 'react';
import { useBookmarkPersistedState } from '@hooks/bookmarks';
import ContainerBox from '@components/ContainerBox';
import ButtonAnimated from '@components/ButtonAnimated';
import { RawLink } from '@components/Link';
import Icon from '@components/Icon';
import { styled, BREAKPOINT_DATA_TABLE_M } from '@stitched';
import { getRouteByName } from '@utils/routes';
import { useWindowResize } from '@hooks/windowResize';
import { trimAccount } from '@utils/account';
import Identicon from '@components/Identicon';

const ContentArea = styled('div', {
  display: 'flex',
  flexFlow: 'column',
  width: '100%',
  height: 'auto',
  padding: '10px',

  '& hr': {
    height: '1px',
    width: '100%',
    background: '$borderGrey',
    margin: '20px 0',
  },

  '& [data-saved-acc-id]': {
    marginBottom: '20px',

    '&:last-child': {
      marginBottom: 0,
    },
  },
});

const Empty = styled('span', {
  fontSize: '$s',
  color: '$midGrey',
});

const Title = styled('span', {
  fontFamily: 'inherit',
  fontSize: '$s',
  fontWeight: 'normal',
});

const SavedItemRowContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',

  '& span:first-child': {
    display: 'flex',
    alignItems: 'center',

    '& span:first-child': {
      flexShrink: 0,
    },

    '& a': {
      lineHeight: '$normal',
      paddingRight: '1em',
    },
  },
});

const SavedItemRow = ({
  account,
  removeHandler,
}: {
  account: string,
  removeHandler: (account: string) => void,
}) => (
  <SavedItemRowContainer
    data-saved-acc-id={account}
  >
    <span>
      <Identicon />
      <RawLink to={getRouteByName('Account', { id: account })}>{account}</RawLink>
    </span>
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
  </SavedItemRowContainer>
);

const initialState: string[] = [];

const SavedAccountsOnPage = () => {
  const isSmallerThanBreakpointCustom = useWindowResize({
    breakpoint: BREAKPOINT_DATA_TABLE_M,
  });
  const [savedAccounts, setSavedAccounts] = useBookmarkPersistedState(initialState);

  const removeHandler = (account: string) => {
    const filtered = savedAccounts?.filter((currentAccount: string) => account !== currentAccount);

    setSavedAccounts(filtered);
  };

  return (
    <ContainerBox
      id="saved-accounts"
    >
      <ContentArea>
        <Title>Saved cap Accounts</Title>
        <hr />
        {
          (
            savedAccounts.length > 0
            && savedAccounts.map((account: string) => (
              <SavedItemRow
                key={account}
                account={
                  isSmallerThanBreakpointCustom
                    ? trimAccount(account)
                    : account
                }
                removeHandler={removeHandler}
              />
            ))
          )
          || <Empty>No pinned ids</Empty>
        }
      </ContentArea>
    </ContainerBox>
  );
};

export default SavedAccountsOnPage;
