import React, { useEffect, useState } from 'react';
import TransactionsTable, { FetchPageDataHandler } from '@components/Tables/TransactionsTable';
import {
  BookmarkColumnModes,
} from '@components/BookmarkPanel';
import SearchInput from '@components/SearchInput';
// import OverallValues from '@components/OverallValues';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import {
  useAccountStore,
  useTransactionStore,
} from '@hooks/store';
import {
  useParams
} from "react-router-dom";
import { trimAccount } from '@utils/account';
import {
  Event as TransactionEvent,
} from '@psychedelic/cap-js';

const AppTransactions = ({
  bookmarkColumnMode,
}: {
  bookmarkColumnMode: BookmarkColumnModes,
}) => {
  const { add } = useAccountStore((state) => state);
  const {
    pageData,
    fetch,
    // transactionEvents,
    // totalTransactions,
    totalPages,
  } = useTransactionStore((state) => state);
  const transactions: TransactionEvent[] = pageData ?? [];

  let { id: tokenId } = useParams() as { id: string };

  // TODO: on fetch by token id and page nr, cache/memoize
  const fetchPageDataHandler: FetchPageDataHandler = ({
    pageIndex,
  }) => fetch({
    tokenId,
    page: pageIndex,
    witness: false,
  });

  useEffect(() => {
    fetch({
      tokenId,
      witness: false,
    });
  }, []);

  useEffect(() => {
    if (!transactions || !transactions.length) return;
    transactions.forEach((item) => add(item.from));
  }, [transactions]);

  return (
    <Page
      pageId="app-transactions-page"
    >
      <PageRow>
        <Title size="xl">{`Application transactions for ${trimAccount(tokenId)}`}</Title>
      </PageRow>
      <PageRow>
        <SearchInput />
      </PageRow>
      <PageRow>
        <TransactionsTable
          data={transactions}
          id="app-transactions-page"
          pageCount={totalPages}
          fetchPageDataHandler={fetchPageDataHandler}
        />
      </PageRow>
    </Page>
  );
};

export default AppTransactions;
