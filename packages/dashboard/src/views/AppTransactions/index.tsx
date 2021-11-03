import React, { useEffect } from 'react';
import TransactionsTable, { FetchPageDataHandler } from '@components/Tables/TransactionsTable';
import Breadcrumb from '@components/Breadcrumb';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import IdentityCopy from '@components/IdentityCopy';
import {
  useTransactionStore,
} from '@hooks/store';
import { useWindowResize } from '@hooks/windowResize';
import {
  useParams
} from "react-router-dom";
import { trimAccount } from '@utils/account';
import {
  Event as TransactionEvent,
} from '@psychedelic/cap-js';
import { scrollTop } from '@utils/window';
import Identity from '@components/Identity';
import { styled, BREAKPOINT_DATA_TABLE_L } from '@stitched';
import { getDabMetadata } from '@utils/dab';

const UserBar = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  height: '40px',
  alignItems: 'center',
});

const AppTransactions = () => {
  const isSmallerThanBreakpointLG = useWindowResize({
    breakpoint: BREAKPOINT_DATA_TABLE_L,
  });
  const {
    isLoading,
    pageData,
    fetch,
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

  // Dab metadata handler
  useEffect(() => {
    const getDabMetadataHandler = async () => {
      const metadata = await getDabMetadata({
        canisterId: tokenId,
      });

      if (!metadata) return;

      // TODO: Update name column, otherwise fallback
    };

    getDabMetadataHandler();
  }, []);

  return (
    <Page
      pageId="app-transactions-page"
    >
      <PageRow>
        <Breadcrumb id={tokenId} />
      </PageRow>
      <PageRow>
        <UserBar
          data-id="user-bar"
        >
          {/* TODO: use dabjs to get the img and name if available, possibly have a fallback */}
          <Identity id={'Transactions'} />
          <IdentityCopy account={
            isSmallerThanBreakpointLG
              ? trimAccount(tokenId)
              : tokenId
            }
          />
        </UserBar>
      </PageRow>
      <PageRow>
        <TransactionsTable
          data={transactions}
          id="app-transactions-page"
          isLoading={isLoading}
          pageCount={totalPages}
          fetchPageDataHandler={fetchPageDataHandler}
        />
      </PageRow>
    </Page>
  );
};

export default AppTransactions;
