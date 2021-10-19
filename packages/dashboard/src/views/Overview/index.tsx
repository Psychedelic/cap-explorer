import React, { useEffect } from 'react';
import AccountsTable from '@components/Tables/AccountsTable';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import {
  useAccountStore,
} from '@hooks/store';

const Overview = () => {
  const {
    pageData,
    fetch,
    reset,
  } = useAccountStore((state) => state);

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
        <Title size="xl">Cap Explorer</Title>
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
