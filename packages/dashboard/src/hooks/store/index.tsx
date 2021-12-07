import create from 'zustand';
import {
  GetTransactionsResponseBorrowed as TransactionsResponse,
  Event as TransactionEvent,
  GetUserRootBucketsResponse as ContractsResponse,
  CapRouter,
  CapRoot,
} from '@psychedelic/cap-js';
import {
  NFTDetails,
} from '@psychedelic/dab-js';
import { Principal } from '@dfinity/principal';
import { getCapRootInstance } from '@utils/cap';
import {
  CanisterMetadata,
  createNFTDetailsHandlerPromiseList,
  mapNftDetailsPromisesResult,
  TokenStandards,
} from '@utils/dab';
import { parseGetTransactionsResponse } from '@utils/transactions';
import { parseUserRootBucketsResponse } from '@utils/account';
import { managementCanisterPrincipal } from '@utils/ic-management-api';
import { AccountData } from '@components/Tables/AccountsTable';
import config from '../../config';
import { shouldUseMockup } from '../../utils/mocks';
import {
  ContractPairedMetadata,
  CanisterKeyPairedMetadata,
  CanisterNameKeyPairedId,
  ContractKeyPairedMetadata,
  getDabMetadata,
  getNFTDetails,
  NFTItemDetails,
} from '@utils/dab';
import {
  preloadPageDataImages,
} from '@utils/images';

export interface AccountStore {
  accounts: ContractsResponse | {},
  canisterKeyPairedMetadata?: CanisterKeyPairedMetadata,
  canisterNameKeyPairedId: CanisterNameKeyPairedId,
  contractPairedMetadata: ContractPairedMetadata[],
  contractKeyPairedMetadata: ContractKeyPairedMetadata,
  isLoading: boolean,
  pageData: AccountData[],
  totalContracts: number,
  totalPages: number,
  fetch: ({ capRouterInstance }: { capRouterInstance: CapRouter } ) => void,
  fetchDabMetadata: ({ pageData }: { pageData: AccountData[] }) => void,
  reset: () => void,
}

// Shall use mockup data?
const USE_MOCKUP = shouldUseMockup();

export const useAccountStore = create<AccountStore>((set, get) => ({
  accounts: {},
  canisterKeyPairedMetadata: {},
  canisterNameKeyPairedId: {},
  contractPairedMetadata: [],
  contractKeyPairedMetadata: {},
  isLoading: false,
  pageData: [],
  totalContracts: 0,
  totalPages: 0,
  fetch: async ({
    // CapRouter has App lifetime, as such
    // should be passed from App top-level
    capRouterInstance,
  }) => {
    set((state: AccountStore) => ({
      ...state,
      isLoading: true,
    }));

    // Shall use mockup data?
    if (USE_MOCKUP) {
      import('@utils/mocks/accountsMockData').then((module) => {
        const pageData =  module.generateData();
        // Mock short delay for loading state tests...
        setTimeout(() => {
          set((state: AccountStore) => ({
            accounts: {},
            pageData,
            totalContracts: pageData.length,
            totalPages: 1,
            isLoading: false,
          }));
        }, 400);
      });

      return;
    }

    // Note: at time of writing the `get_user_root_buckets`
    // has no support for paginated response
    // TODO: seems best to call the methods from the Actor directly
    // there's no need for the method wrappers
    // TODO: Cap-js type definitions are not showing at time of writing 
    // and needs to be fixed
    const response = await capRouterInstance.get_user_root_buckets({
      user: (managementCanisterPrincipal as any),
      witness: false,
    });

    if (!response || !Array.isArray(response?.contracts) || !response?.contracts.length) {
      // TODO: What to do if no response? Handle gracefully

      // Loading stops
      set((state: AccountStore) => ({
        ...state,
        isLoading: false,
      }));

      return;
    }

    // Prepare the Root, Token Contract pair
    let promisedTokenContractsPairedRoots: Record<string, Promise<string | undefined>> = {};

    for await (const contract of response.contracts as Principal[]) {
      const canisterId = contract.toText();
      let capRoot: CapRoot;
    
      promisedTokenContractsPairedRoots[canisterId] = (async () => {
        try {
          capRoot = await getCapRootInstance({
            canisterId,
            host: config.host,
          });

          const tokenContractPrincipal = await capRoot.contract_id();

          if (!tokenContractPrincipal) throw Error('Oops! Unexpected token contract id response');

          return tokenContractPrincipal.toText();
        } catch (err) {
          console.warn('Oops! CAP instance initialisation failed with', err);
        }
      })()
    }

    let pageData = await parseUserRootBucketsResponse({
      ...response,
      promisedTokenContractsPairedRoots,
    });

    // Fetch the Dab metadata
    await get().fetchDabMetadata({ pageData });

    const contractPairedMetadata = await get().contractPairedMetadata;

    const contractKeyPairedMetadata = contractPairedMetadata.reduce((acc, curr) => {
      acc[curr.contractId] = curr?.metadata
      return acc;
    }, {} as Record<string, CanisterMetadata>);

    pageData = pageData.map(({ contractId, dabCanister }: AccountData) => {
      return ({
        contractId,
        dabCanister: {
          ...dabCanister,
          metadata: contractKeyPairedMetadata?.[contractId],
        }
      })
    });

    await preloadPageDataImages({ pageData });

    const canisterKeyPairedMetadata = (pageData as AccountData[]).reduce((acc, curr: AccountData) => {
      if (!curr.dabCanister.metadata) return acc;

      return {
        ...acc,
        [curr.contractId]: curr.dabCanister.metadata,
      };
    }, {} as CanisterKeyPairedMetadata);

    const canisterNameKeyPairedId = 
      Object
        .keys(canisterKeyPairedMetadata)
        .reduce((acc, curr) => {
        return {
          ...acc,
          [canisterKeyPairedMetadata[curr].name]: curr,
        }
      }, {} as { [name: string]: string });

    set((state: AccountStore) => ({
      accounts: response,
      canisterKeyPairedMetadata,
      canisterNameKeyPairedId,
      contractKeyPairedMetadata,
      isLoading: false,
      pageData,
      totalContracts: pageData.length,
      totalPages: 1,
    }));
  },
  // TODO: This was used temporarily
  // since big search is not yet available
  fetchDabMetadata: async ({
    pageData,
  }: {
    pageData: AccountData[],
  }) => {
    const promises = pageData.map(
      ({ contractId }) =>
        (async () => {
          const metadata = await getDabMetadata({
            canisterId: contractId,
          });

          if (!metadata) return undefined;
          
          return {
            contractId,
            metadata,
          };
        })()
    );

    const promiseResponse: (ContractPairedMetadata | undefined)[] = await Promise.all(promises);

    const contractPairedMetadata = promiseResponse.filter(d => d) as ContractPairedMetadata[];

    const canisterKeyPairedMetadata: CanisterKeyPairedMetadata = 
        contractPairedMetadata
          .reduce((acc, curr) => ({
            ...acc,
            [curr.contractId]: curr.metadata,
          }), {});

    const canisterNameKeyPairedId: CanisterNameKeyPairedId = 
      Object
        .keys(canisterKeyPairedMetadata)
        .reduce((acc, curr) => {
        return {
          ...acc,
          [canisterKeyPairedMetadata[curr].name]: curr,
        }
      }, {});

    set((state: AccountStore) => ({
      ...state,
      canisterKeyPairedMetadata,
      canisterNameKeyPairedId,
      contractPairedMetadata,
    }));
  },
  reset: () => set((state: AccountStore) => ({
    pageData: [],
    accounts: {},
    totalContracts: 0,
    totalPages: 0,
  })),
}));

interface TransactionsFetchParams {
  tokenId: string,
  page?: number,
  witness: boolean,
}

export interface TransactionsStore {
  isLoading: boolean,
  page: number | undefined,
  pageData: TransactionEvent[] | undefined,
  transactionEvents: TransactionEvent[] | [],
  totalTransactions: number,
  totalPages: number,
  fetch: (params: TransactionsFetchParams) => void,
  reset: () => void,
}

export const PAGE_SIZE = 64;

const MIN_PAGE_NUMBER = 1;

export const useTransactionStore = create<TransactionsStore>((set) => ({
  pageData: undefined,
  isLoading: false,
  transactionEvents: [],
  totalTransactions: 0,
  totalPages: 0,
  page: undefined,
  setIsLoading: async (isLoading: boolean) => {
    set((state: TransactionsStore) => ({
      isLoading,
    }));
  },
  fetch: async ({
    tokenId,
    page,
    witness = false,
  }: TransactionsFetchParams) => {
    set((state: TransactionsStore) => ({
      ...state,
      isLoading: true,
      page,
    }));

    // Shall use mockup data?
    if (USE_MOCKUP) {
      import('@utils/mocks/transactionsTableMockData').then((module) => {
        const pageData =  module.generateData();
        const totalTransactions = PAGE_SIZE * 1 + pageData.length;
        const totalPages = Math.ceil(totalTransactions > PAGE_SIZE ? totalTransactions / PAGE_SIZE : 1);
        
        // Mock short delay for loading state tests...
        setTimeout(() => {
          set((state: TransactionsStore) => ({
            isLoading: false,
            pageData,
            transactionEvents: [
              ...state.transactionEvents,
              pageData,
            ],
            // TODO: For totalTransactions/Pages Check TODO above,
            // as total transactions at time of writing
            // can only be computed on first page:None request...
            totalTransactions,
            totalPages,
          }));
        }, 400);
      });

      return;
    }

    let capRoot: CapRoot;

    try {
      capRoot = await getCapRootInstance({
        canisterId: tokenId,
        host: config.host,
      });
    } catch (err) {
      console.warn('Oops! CAP instance initialisation failed with', err);
      // TODO: What to do if cap root initialisation fails? Handle gracefully

      set((state: TransactionsStore) => ({
        ...state,
        isLoading: false,
      }));

      return;
    }

    // Alternatively, methods call can be done directly in the Actor
    // the wrapped method is inplace to allow caching by e.g. kyassu
    // the only "inconvinence" here is that page would have to pass [] on none
    // e.g. capRoot.actor.get_transactions({ page: [], witness: false });
    const response: TransactionsResponse = await capRoot.get_transactions({
      page,
      witness,
    });

    if (!response || !Array.isArray(response?.data) || !response?.data.length) {
      // TODO: What to do if no response? Handle gracefully

      set((state: TransactionsStore) => ({
        ...state,
        isLoading: false,
        totalPages: MIN_PAGE_NUMBER,
        pageData: [],
      }));

      return;
    }

    // At time of writing there's no support for requesting a particular page number
    // if that'd be the case, the total transactions calculation would fail...
    const totalTransactions = PAGE_SIZE * response.page + response.data.length;

    const getTotalPages = (totalPages: number) => {
      const count = totalTransactions > PAGE_SIZE ? totalTransactions / PAGE_SIZE : 1;
      // The initial request determinates the total nr of pages
      // afterwards, we get the index we're in
      // as such, we keep track and persist the initial number
      return Math.max(MIN_PAGE_NUMBER, totalPages, Math.ceil(count));
    };
    const pageData = parseGetTransactionsResponse(response);

    set((state: TransactionsStore) => ({
      isLoading: false,
      pageData,
      transactionEvents: [
        ...state.transactionEvents,
        pageData,
      ],
      // As noted above the total transactions
      // are calculated on initial call
      // we persist the initial state by max value fallback
      totalTransactions: Math.max(
        totalTransactions,
        state.totalTransactions,
      ),
      totalPages: getTotalPages(state.totalPages),
    }));
  },
  reset: () => set((state: TransactionsStore) => ({
    pageData: undefined,
    transactionEvents: [],
    totalTransactions: 0,
    totalPages: 0,
  })),
}));

export interface DabStore {
  isLoading: boolean,
  nftItemDetails: NFTItemDetails,
  fetchDabItemDetails: ({
    data,
    tokenId,
    standard,
  }: {
    data: any[],
    tokenId: string,
    standard: TokenStandards,
  }) => void,
}

export const useDabStore = create<DabStore>((set, get) => ({
  isLoading: false,
  nftItemDetails: {},
  fetchDabItemDetails: async ({
    data,
    tokenId,
    standard,
  }: {
    data: TransactionEvent[],
    tokenId: string,
    standard: TokenStandards,
  }) => {
    const nftItemDetails = get().nftItemDetails;

    const dabNFTMetadataPromises = createNFTDetailsHandlerPromiseList({
      nftItemDetails,
      standard,
      tokenId,
      transactionEvents: data,
    });

    if (!dabNFTMetadataPromises) {
      console.warn('Oops! NFT Details handling will not proceed. Is the transaction events empty?')

      return;
    }

    set({
      isLoading: true,
    });

    // TODO: Could split into parts to accelerate availability to end user?
    // If so, this seems to be done outside this scope
    const dabNFTMetadataPromiseRes: NFTDetails[] = await Promise.all(dabNFTMetadataPromises);

    const currNftItemDetails = mapNftDetailsPromisesResult({
      dabNFTMetadataPromiseRes,
      cachedNftItemDetails: nftItemDetails,
    });

    set({
      isLoading: false,
      nftItemDetails: currNftItemDetails,
    })
  },
}));
