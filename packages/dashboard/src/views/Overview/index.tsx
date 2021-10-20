import React, { useEffect } from 'react';
import AccountsTable from '@components/Tables/AccountsTable';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import {
  AccountStore,
} from '@hooks/store';
import { CapRouter } from '@psychedelic/cap-js';

const Overview = ({
  accountStore,
  capRouterInstance,
}: {
  accountStore: AccountStore,
  capRouterInstance: CapRouter | undefined,
}) => {
  const {
    pageData,
    fetch,
    reset,
  } = accountStore;

  useEffect(() => {
    if (!capRouterInstance) return;
    
    // TODO: cache/memoizing fetch call
    fetch({
      capRouterInstance,
    });

    return () => reset();
  }, [capRouterInstance]);

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
