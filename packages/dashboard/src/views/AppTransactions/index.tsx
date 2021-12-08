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
  getDabMetadata,
  CanisterMetadata,
  isValidStandard,
  TokenStandards,
  TokenContractKeyPairedStandard,
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
  tokenContractKeyPairedStandard,
}: {
  capRouterInstance: CapRouter | undefined,
  tokenContractKeyPairedStandard: TokenContractKeyPairedStandard,
}) => {
  const dabStore = useDabStore();
  const {
    isLoading: isLoadingDabItemDetails,
    fetchDabItemDetails,
    nftItemDetails,
  } = dabStore;
  const accountStore = useAccountStore();
  const { contractKeyPairedMetadata } = accountStore;
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDabMetada, setIsLoadingDabMetada] = useState(true);
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
    if (!pageData) return;

    setTransactions(pageData);
  }, [pageData]);

  useEffect(() => {
    if (!pageData || !identityInDab) return;

    // Should validate if known standard
    const foundStandard = tokenContractKeyPairedStandard[tokenId];

    if (!isValidStandard(foundStandard)) {
      console.warn(`Oops! Standard ${foundStandard} is unknown`)

      return;
    };

    fetchDabItemDetails({
      data: pageData,
      tokenId,
      standard: foundStandard as TokenStandards,
    });
  }, [pageData, identityInDab]);

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

  // TODO: This might be already in cache, if the user comes from Overview
  // Dab metadata handler
  useEffect(() => {
    const getDabMetadataHandler = async () => {    
      setIsLoadingDabMetada(true);

      const metadata = await getDabMetadata({
        canisterId: tokenId,
      });

      if (!metadata) return;

      // TODO: Update name column, otherwise fallback
      setIdentityInDab({
        ...metadata,
      });
    };

    if (!contractKeyPairedMetadata || !tokenId) {
      getDabMetadataHandler();

      return;
    };

    const identityInDab = contractKeyPairedMetadata[tokenId];

    if (!identityInDab) {
      getDabMetadataHandler();

      return;
    };

    setIdentityInDab(identityInDab);
  }, [contractKeyPairedMetadata, tokenId]);

  useEffect(() => {
    if (!identityInDab) return;

    setIsLoadingDabMetada(false);
  }, [identityInDab]);

  return (
    <Page
      pageId="app-transactions-page"
    >
      <PageRow>
        <Breadcrumb identityInDab={identityInDab} isLoading={isLoadingDabMetada} />
      </PageRow>
      <PageRow>
        <UserBar
          data-id="user-bar"
        >
          <DabLink tokenContractId={tokenId}>
          {
            identityInDab
            ? <IdentityDab large={true} name={identityInDab?.name} image={identityInDab?.logo_url} isLoading={isLoadingDabMetada} />
            : <IdentityDab large={true} name='Unknown' isLoading={isLoadingDabMetada} />
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
          tokenId={tokenId}
          nftItemDetails={nftItemDetails}
          isLoadingDabItemDetails={isLoadingDabItemDetails}
        />
      </PageRow>
    </Page>
  );
};

export default AppTransactions;
