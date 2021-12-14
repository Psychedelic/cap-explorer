import React, { useEffect, useState } from 'react';
import TransactionsTable, { FetchPageDataHandler } from '@components/Tables/TransactionsTable';
import Breadcrumb from '@components/Breadcrumb';
import Page, { PageRow } from '@components/Page';
import IdentityCopy from '@components/IdentityCopy';
import { DabLink } from '@components/Link';
import {
  useTransactionStore,
  useAccountStore,
} from '@hooks/store';
import { useWindowResize } from '@hooks/windowResize';
import {
  useParams
} from "react-router-dom";
import {
  CapRouter,
  Event as TransactionEvent,
} from '@psychedelic/cap-js';
import { scrollTop } from '@utils/window';
import { styled, BREAKPOINT_DATA_TABLE_L } from '@stitched';
import {
  isValidStandard,
  TokenStandards,
} from '@utils/dab';
import IdentityDab from '@components/IdentityDab';
import OverallValues from '@components/OverallValues';
import { Principal } from '@dfinity/principal';
import { useDabStore } from '@hooks/store';

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
  const { id: tokenId } = useParams() as { id: string };

  const dabStore = useDabStore();
  const {
    isLoading: isLoadingDabItemDetails,
    fetchDabItemDetails,
    nftItemDetails,
  } = dabStore;
  const accountStore = useAccountStore();
  const {
    contractKeyPairedMetadata,
  } = accountStore;
  const metadata = contractKeyPairedMetadata[tokenId];
  const [isLoading, setIsLoading] = useState(false);
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

  // TODO: on fetch by token id and page nr, cache/memoize
  const fetchPageDataHandler: FetchPageDataHandler = async ({
    pageIndex,
  }) => {
    // Skip initial page because it's handled in the
    // scope of this component useEffect on mount call
    if (typeof pageIndex === 'undefined' || !rootCanisterId) return;

    // Create the page numbers from zero to total pages
    // and inverse the order to use by the UI page index
    // The page is the formula, but using the array to improve readability
    // ((totalPages - pageIndex) + 1) - totalPages;
    const pages = Array.from(Array(totalPages).keys()).reverse();
    const page = pages[pageIndex];

    await setIsLoading(true);

    await fetch({
      tokenId: rootCanisterId,
      page,
      witness: false,
    });
 
    scrollTop();
  }
  
  useEffect(() => {
    // Loading should be triggered
    // if the metadata is not available
    // while the page data process is resolved
    // see 'page data initialisation process'
    if (metadata) return;

    setIsLoading(true);
  }, []);
  
  useEffect(() => {
    if (!pageData) return;

    setTransactions(pageData);
  }, [pageData]);

  useEffect(() => {
    if (!pageData) return;

    // Should validate if known standard
    const foundStandard = metadata?.standard;

    if (!isValidStandard(foundStandard)) {
      console.warn(`Oops! Standard ${foundStandard} is unknown`)

      return;
    };

    fetchDabItemDetails({
      data: pageData,
      tokenId,
      standard: foundStandard as TokenStandards,
    });
  }, [pageData]);

  // The page data initialisation process
  useEffect(() => {
    if (!rootCanisterId || !capRouterInstance) return;

    // The metadata is not available when
    // a transaction page is requested directly
    // when not requested from the app entry point or Overview
    // for this reason, the metada should be requested
    (async () => {
      if (!metadata) {
        await accountStore.fetch({
          capRouterInstance,
          dabStore,
        });
      }

      await fetch({
        tokenId: rootCanisterId,
        witness: false,
      });
    })()

    // On unmount, reset the transaction state (page data)
    return () => reset();
  }, [rootCanisterId, capRouterInstance]);

  useEffect(() => {
    if (!transactions) return;

    setIsLoading(false);
  }, [transactions]);

  useEffect(() => {
    (async () => {
      if (!capRouterInstance) return;

      const { canister } = await capRouterInstance.get_token_contract_root_bucket({
        // At time of writing the typedef in cap-js
        // differs from the downgraded dfinity principal
        // in the cap-explorer project
        tokenId: (Principal.fromText(tokenId) as any),
      });

      const rootCanisterId = canister?.[0];

      if (!rootCanisterId) {
        console.warn(`Oops! Failed to retrieve the root bucket for token id ${tokenId}`);

        return;
      }

      setRootCanisterId(rootCanisterId.toText());
    })();
  }, [pageData]);

  // Use as a fallback when the page data needs to be handled (long process)
  // while the metadata is readily available to the end-user
  // as such, we don't want to hide components to show `loading`
  const isPageDataProcessing = !Array.isArray(pageData);

  return (
    <Page
      pageId="app-transactions-page"
    >
      <PageRow>
        <Breadcrumb
          metadata={metadata}
          isLoading={isLoading}
        />
      </PageRow>
      <PageRow>
        <UserBar
          data-id="user-bar"
        >
          <DabLink tokenContractId={tokenId}>
          {
            metadata
            ? <IdentityDab large={true} name={metadata?.name} image={metadata?.icon} isLoading={isLoading} />
            : <IdentityDab large={true} name='Unknown' isLoading={isLoading} />
          }
          </DabLink>
          <IdentityCopy
            account={ tokenId }
            trim={isSmallerThanBreakpointLG}
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
          isLoading={isLoading || isPageDataProcessing}
        />
      </PageRow>
      <PageRow>
        <TransactionsTable
          data={transactions}
          id="app-transactions-page"
          isLoading={isLoading || isPageDataProcessing}
          pageCount={totalPages}
          fetchPageDataHandler={fetchPageDataHandler}
          metadata={metadata}
          tokenId={tokenId}
          nftItemDetails={nftItemDetails}
          isLoadingDabItemDetails={isLoadingDabItemDetails}
        />
      </PageRow>
    </Page>
  );
};

export default AppTransactions;
