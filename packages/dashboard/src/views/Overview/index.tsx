import React, {
  useEffect,
  useState,
} from 'react';
import AccountsTable from '@components/Tables/AccountsTable';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import {
  useAccountStore,
  useDabStore,
} from '@hooks/store';
import { CapRouter } from '@psychedelic/cap-js';
import OverallValues from '@components/OverallValues';
import SearchInput from '@components/SearchInput';

const Overview = ({
  capRouterInstance,
}: {
  capRouterInstance: CapRouter | undefined,
}) => {
  const [pageLoading, setPageLoading] = useState(false);
  const dabStore = useDabStore();
  const accountStore = useAccountStore();

  const {
    pageData,
    fetch,    
  } = accountStore;

  useEffect(() => {
    setPageLoading(true);
  }, []);

  useEffect(() => {
    if (!capRouterInstance) return;

    // If data is ready, interrupt
    // at time of writing the data persists
    // after the initial call, has we don't have
    // a big number, thus no pagination
    // once added to Service side, then
    // it should be memoized by the page id
    // TODO: memoize the store selector instead
    if (pageData.length) {
      setPageLoading(false);

      return;
    }

    // Async call
    (async () => {
      await fetch({
        capRouterInstance,
        // Optionally, maybe Move this to the fn handler
        dabStore,
      });

      setPageLoading(false);
    })();
  }, [capRouterInstance]);

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
        />
      </PageRow>
    </Page>
  );
};

export default Overview;
