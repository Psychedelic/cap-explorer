import React, { useEffect, useState } from 'react';
import TransactionsTable, { FetchPageDataHandler } from '@components/Tables/TransactionsTable';
import Breadcrumb from '@components/Breadcrumb';
import Page, { PageRow } from '@components/Page';
import IdentityCopy from '@components/IdentityCopy';
import { DabLink } from '@components/Link';
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
  CapRouter,
  Event as TransactionEvent,
} from '@psychedelic/cap-js';
import { scrollTop } from '@utils/window';
import { styled, BREAKPOINT_DATA_TABLE_L } from '@stitched';
import { getDabMetadata, CanisterMetadata } from '@utils/dab';
import IdentityDab from '@components/IdentityDab';
import OverallValues from '@components/OverallValues';
import { Principal } from '@dfinity/principal';

const UserBar = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  height: '40px',
  alignItems: 'center',
});

const AppTransactions = ({
  capRouterInstance,
}: {
  capRouterInstance: CapRouter | undefined,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [identityInDab, setIdentityInDab] = useState<CanisterMetadata>();
  const isSmallerThanBreakpointLG = useWindowResize({
    breakpoint: BREAKPOINT_DATA_TABLE_L,
  });
  const {
    pageData,
    fetch,
    totalPages,
    reset,
    totalTransactions,
  } = useTransactionStore((state) => state);
  const [rootCanisterId, setRootCanisterId] = useState<string>();
  const [transactions, setTransactions] = useState<TransactionEvent>(undefined);

  let { id: tokenId } = useParams() as { id: string };

  // TODO: on fetch by token id and page nr, cache/memoize
  const fetchPageDataHandler: FetchPageDataHandler = async ({
    pageIndex,
  }) => {
    // Skip initial page because it's handled in the
    // scope of this component useEffect on mount call
    if (!pageIndex || !rootCanisterId) return;

    await fetch({
      tokenId: rootCanisterId,
      page: pageIndex,
      witness: false,
    });

    scrollTop();
  }
  
  useEffect(() => {
    if (!pageData) return;

    setTransactions(pageData);
  }, [pageData]);

  useEffect(() => {
    if (!rootCanisterId) return;

    fetch({
      tokenId: rootCanisterId,
      witness: false,
    });

    // On unmount, reset the transaction state
    return () => reset();
  }, [rootCanisterId]);

  useEffect(() => {
    if (!transactions) return;

    setIsLoading(false);
  }, [transactions]);

  useEffect(() => {
    (async () => {
      if (!capRouterInstance) return;

      const { canister } = await capRouterInstance.get_token_contract_root_bucket({
        tokenId: Principal.fromText(tokenId),
      });

      const rootCanisterId = canister?.[0];

      if (!rootCanisterId) {
        console.warn(`Oops! Failed to retrieve the root bucket for token id ${tokenId}`);

        return;
      }

      setRootCanisterId(rootCanisterId.toText());
    })();
  }, [pageData]);

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
        <Breadcrumb identityInDab={identityInDab} isLoading={isLoading} />
      </PageRow>
      <PageRow>
        <UserBar
          data-id="user-bar"
        >
          <DabLink tokenContractId={tokenId}>
          {
            identityInDab
            ? <IdentityDab large={true} name={identityInDab?.name} image={identityInDab?.logo_url} />
            : <IdentityDab large={true} name='Unknown' />
          }
          </DabLink>
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
          isLoading={isLoading}
        />
      </PageRow>
      <PageRow>
        <TransactionsTable
          data={transactions}
          id="app-transactions-page"
          isLoading={isLoading}
          pageCount={totalPages}
          fetchPageDataHandler={fetchPageDataHandler}
          identityInDab={identityInDab}
        />
      </PageRow>
    </Page>
  );
};

export default AppTransactions;
