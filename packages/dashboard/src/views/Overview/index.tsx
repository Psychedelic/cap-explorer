import React, { useEffect } from 'react';
import AccountsTable from '@components/Tables/AccountsTable';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import {
  AccountStore,
} from '@hooks/store';

const Overview = ({
  accountStore
}: {
  accountStore: AccountStore,
}) => {
  const {
    pageData,
    fetch,
    reset,
  } = accountStore;

  useEffect(() => {
    // TODO: cache/memoizing fetch call
    fetch();

    return () => reset();
  }, []);

  return (
    <Page
      pageId="overview"
    >
      <PageRow>
        <Title size="xl">CAP Explorer</Title>
      </PageRow>
      <PageRow>
        <AccountsTable
          data={pageData}
          id="overview-page-transactions"
        />
      </PageRow>
    </Page>
  );
};

export default Overview;
