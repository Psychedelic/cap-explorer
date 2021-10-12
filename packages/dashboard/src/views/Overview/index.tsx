import React, { useEffect } from 'react';
import AccountsTable from '@components/Tables/AccountsTable';
import {
  BookmarkColumnModes,
} from '@components/BookmarkPanel';
import SearchInput from '@components/SearchInput';
import OverallValues from '@components/OverallValues';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import { useAccountStore } from '@hooks/store';
import useAccounts from '@hooks/useAccounts';

const Overview = ({
  bookmarkColumnMode,
}: {
  bookmarkColumnMode: BookmarkColumnModes,
}) => {
  const { add } = useAccountStore((state) => state);
  const accountsData = useAccounts();

  useEffect(() => {
    if (!accountsData) return;
    accountsData.forEach((item) => add(item.canister));
  }, [accountsData]);

  return (
    <Page
      pageId="overview"
    >
      <PageRow>
        <Title size="xl">Cap Explorer</Title>
      </PageRow>
      <PageRow>
        <SearchInput />
      </PageRow>
      <PageRow>
        <OverallValues />
      </PageRow>
      <PageRow>
        <AccountsTable
          data={accountsData}
          id="overview-page-transactions"
        />
      </PageRow>
    </Page>
  );
};

export default Overview;
