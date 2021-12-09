import React, {
  useEffect,
  useState,
} from 'react';
import AccountsTable from '@components/Tables/AccountsTable';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import {
  AccountStore,
} from '@hooks/store';
import { CapRouter } from '@psychedelic/cap-js';
import OverallValues from '@components/OverallValues';
import SearchInput from '@components/SearchInput';
import { DABCollection } from '@utils/dab';

const Overview = ({
  accountStore,
  capRouterInstance,
  dabCollection,
}: {
  accountStore: AccountStore,
  capRouterInstance: CapRouter | undefined,
  dabCollection: DABCollection,
}) => {
  const {
    isLoading,
    pageData,
    fetch,    
  } = accountStore;
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // At time of writing we get the complete DAB Collection
    // once the Service changes to support pagination
    // this will have to change
    // TODO: The dab collection should be fetched in the account store
    // as it should be coupled to the account request control by page
    if (!capRouterInstance || !dabCollection.length) return;

    // If data is ready, interrupt
    // at time of writing the data persists
    // after the initial call, has we don't have
    // a big number, thus no pagination
    // once added to Service side, then
    // it should be memoized by the page id
    if (pageData.length) return;

    fetch({
      capRouterInstance,
      dabCollection,
    });

    console.log('[debug] Overview: loading: true');
  }, [capRouterInstance, dabCollection]);

  useEffect(() => {
    // The OVerview component controls the page load state
    // instead of relying in the dispatched store loading state
    if (typeof pageData === 'undefined' || isLoading) return;

    setPageLoading(false);
    console.log('[debug] Overview: loading: false');
  }, [pageData])

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
          isLoading={pageLoading}
        />
      </PageRow>
      <PageRow>
        <AccountsTable
          data={pageData}
          id="overview-page-transactions"
          isLoading={pageLoading}
          dabCollection={dabCollection}
        />
      </PageRow>
    </Page>
  );
};

export default Overview;
