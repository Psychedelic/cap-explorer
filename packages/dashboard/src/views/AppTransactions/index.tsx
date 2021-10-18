import React, { useEffect } from 'react';
import TransactionsTable from '@components/Tables/TransactionsTable';
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
  GetTransactionsResponseBorrowed as TransactionsResponse,
  Event as TransactionEvent,
} from '@psychedelic/cap-js';

const AppTransactions = ({
  bookmarkColumnMode,
}: {
  bookmarkColumnMode: BookmarkColumnModes,
}) => {
  const { add } = useAccountStore((state) => state);
  const {fetch, transactions } = useTransactionStore((state) => state);
  const transactionEvents: TransactionEvent[] = transactions[0] ?? [];

  let { id: tokenId } = useParams() as { id: string };

  useEffect(() => {
    fetch({
      tokenId,
      witness: false,
    });
  }, []);

  useEffect(() => {
    if (!transactionEvents || !transactionEvents.length) return;
    transactionEvents.forEach((item) => add(item.from));
  }, [transactionEvents]);

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
          data={transactionEvents}
          id="app-transactions-page"
        />
      </PageRow>
    </Page>
  );
};

export default AppTransactions;
