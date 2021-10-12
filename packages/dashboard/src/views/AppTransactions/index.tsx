import React, { useEffect } from 'react';
import TransactionsTable from '@components/Tables/TransactionsTable';
import {
  BookmarkColumnModes,
} from '@components/BookmarkPanel';
import SearchInput from '@components/SearchInput';
// import OverallValues from '@components/OverallValues';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import { useAccountStore } from '@hooks/store';
import useTransactions from '@hooks/useTransactions';
import {
  useParams
} from "react-router-dom";
import { trimAccount } from '@utils/account';

const AppTransactions = ({
  bookmarkColumnMode,
}: {
  bookmarkColumnMode: BookmarkColumnModes,
}) => {
  const { add } = useAccountStore((state) => state);
  const transactionsData = useTransactions();
  let { id } = useParams() as { id: string };

  useEffect(() => {
    if (!transactionsData || !transactionsData.length) return;
    transactionsData.forEach((item) => add(item.from));
  }, [transactionsData]);

  return (
    <Page
      pageId="app-transactions-page"
    >
      <PageRow>
        <Title size="xl">{`Application transactions for ${trimAccount(id)}`}</Title>
      </PageRow>
      <PageRow>
        <SearchInput />
      </PageRow>
      <PageRow>
        <TransactionsTable
          data={transactionsData}
          id="app-transactions-page"
        />
      </PageRow>
    </Page>
  );
};

export default AppTransactions;
