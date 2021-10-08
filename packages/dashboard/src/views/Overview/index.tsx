import React, { useEffect } from 'react';
import TransactionsTable from '@components/Tables/TransactionsTable';
import {
  BookmarkColumnModes,
} from '@components/BookmarkPanel';
import SearchInput from '@components/SearchInput';
import OverallValues from '@components/OverallValues';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import { useAccountStore } from '@hooks/store';
import useTransactions from '@hooks/useTransactions';

const Overview = ({
  bookmarkColumnMode,
}: {
  bookmarkColumnMode: BookmarkColumnModes,
}) => {
  const { add } = useAccountStore((state) => state);
  const transactionsData = useTransactions();

  useEffect(() => {
    if (!transactionsData || !transactionsData.length) return;
    transactionsData.forEach((item) => add(item.from));
  }, [transactionsData]);

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
        <TransactionsTable
          data={transactionsData}
          id="overview-page-transactions"
        />
      </PageRow>
    </Page>
  );
};

export default Overview;
