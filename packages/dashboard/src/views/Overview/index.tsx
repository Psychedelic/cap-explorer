import React, { useEffect } from 'react';
import AccountsTable from '@components/Tables/AccountsTable';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import {
  AccountStore,
} from '@hooks/store';
import { CapRouter } from '@psychedelic/cap-js';
import OverallValues from '@components/OverallValues';

const Overview = ({
  accountStore,
  capRouterInstance,
}: {
  accountStore: AccountStore,
  capRouterInstance: CapRouter | undefined,
}) => {
  const {
    isLoading,
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

    // TODP: should only reset on unmount
    // when pagination is ready
    // return () => reset();
  }, [capRouterInstance]);

  return (
    <Page
      pageId="overview"
    >
      <PageRow>
        <Title size="xl">Cap Explorer</Title>
      </PageRow>
      <PageRow>
        <OverallValues
          data={[
            {
              name: 'Total Assets',
              value: pageData.length,
            },
          ]}
          isLoading={isLoading}
        />
      </PageRow>
      <PageRow>
        <AccountsTable
          data={pageData}
          id="overview-page-transactions"
          isLoading={isLoading}
        />
      </PageRow>
    </Page>
  );
};

export default Overview;
