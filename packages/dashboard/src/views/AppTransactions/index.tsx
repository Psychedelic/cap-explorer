import React, { useEffect } from 'react';
import TransactionsTable, { FetchPageDataHandler } from '@components/Tables/TransactionsTable';
import {
  BookmarkColumnModes,
} from '@components/BookmarkPanel';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import {
  useTransactionStore,
} from '@hooks/store';
import {
  useParams
} from "react-router-dom";
import { trimAccount } from '@utils/account';
import {
  Event as TransactionEvent,
} from '@psychedelic/cap-js';
import { scrollTop } from '@utils/window';

const AppTransactions = ({
  bookmarkColumnMode,
}: {
  bookmarkColumnMode: BookmarkColumnModes,
}) => {
  const {
    pageData,
    fetch,
    // transactionEvents,
    // totalTransactions,
    totalPages,
    reset,
  } = useTransactionStore((state) => state);
  const transactions: TransactionEvent[] = pageData ?? [];

  let { id: tokenId } = useParams() as { id: string };

  // TODO: on fetch by token id and page nr, cache/memoize
  const fetchPageDataHandler: FetchPageDataHandler = async ({
    pageIndex,
  }) => {
    await fetch({
      tokenId,
      page: pageIndex,
      witness: false,
    });

    scrollTop();
  }

  useEffect(() => {
    fetch({
      tokenId,
      witness: false,
    });

    // On unmount, reset the transaction state
    return () => reset();
  }, []);

  return (
    <Page
      pageId="app-transactions-page"
    >
      <PageRow>
        <Title size="xl">{`Transactions for ${trimAccount(tokenId)}`}</Title>
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
