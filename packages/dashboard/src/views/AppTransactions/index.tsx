import React, { useEffect, useState } from 'react';
import TransactionsTable, { FetchPageDataHandler } from '@components/Tables/TransactionsTable';
import Breadcrumb from '@components/Breadcrumb';
import Page, { PageRow } from '@components/Page';
import IdentityCopy from '@components/IdentityCopy';
import {
  useTransactionStore,
  PAGE_SIZE,
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
import { styled, BREAKPOINT_DATA_TABLE_L } from '@stitched';
import { getDabMetadata, CanisterMetadata } from '@utils/dab';
import IdentityDab from '@components/IdentityDab';
import OverallValues from '@components/OverallValues';

const UserBar = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  height: '40px',
  alignItems: 'center',
});

const AppTransactions = () => {
  const [identityInDab, setIdentityInDab] = useState<CanisterMetadata>();
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

  const totalTransactions = pageData.length > PAGE_SIZE
              ? pageData.length + (PAGE_SIZE * totalPages)
              : pageData.length;
  const transactions: TransactionEvent[] = pageData ?? [];
  
  let { id: tokenId } = useParams() as { id: string };

  // TODO: on fetch by token id and page nr, cache/memoize
  const fetchPageDataHandler: FetchPageDataHandler = async ({
    pageIndex,
  }) => {
    // Skip initial page because it's handled in the
    // scope of this component useEffect on mount call
    if (!pageIndex) return;

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
      setIdentityInDab({
        ...metadata,
      });
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
          {
            identityInDab
            ? <IdentityDab name={identityInDab?.name} image={identityInDab?.logo_url} />
            : undefined
          }
          <IdentityCopy account={
            isSmallerThanBreakpointLG
              ? trimAccount(tokenId)
              : tokenId
            }
          />
        </UserBar>
      </PageRow>
      <PageRow>
        <OverallValues
          data={[
            {
              name: 'Total transactions',
              value: totalTransactions,
            },
          ]}
        />
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
