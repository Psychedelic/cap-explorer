import React, { useEffect } from 'react';
import AccountsTable from '@components/Tables/AccountsTable';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import {
  AccountStore,
} from '@hooks/store';
import { CapRouter } from '@psychedelic/cap-js';
import OverallValues from '@components/OverallValues';
import SearchInput from '@components/SearchInput';

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
    fetchDabMetadata,
  } = accountStore;

  useEffect(() => {
    if (!capRouterInstance) return;

    // If data is ready, interrupt
    if (pageData.length) return;
    
    // TODO: cache/memoizing fetch call
    fetch({
      capRouterInstance,
    });
  }, [capRouterInstance]);

  useEffect(() => {
    if (!pageData.length) return;

    // TODO: this is temporary
    // while big search is not available
    // should be removed after
    fetchDabMetadata();
  }, [pageData]);

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
