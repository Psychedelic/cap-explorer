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
  getDabMetadata,
  getNFTDetails,
} from '@utils/dab';
import {
  preloadPageDataImages,
} from '@utils/images';

export interface AccountStore {
  accounts: ContractsResponse | {},
  canisterKeyPairedMetadata?: CanisterKeyPairedMetadata,
  canisterNameKeyPairedId: CanisterNameKeyPairedId,
  contractPairedMetadata: ContractPairedMetadata[],
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

    // Update the pageData with the metadata
    pageData = [
      ...pageData,
      ...contractPairedMetadata.map(({
        contractId,
        metadata,
      }) => ({
        contractId,
        dabCanister: {
          contractId,
          metadata,
        },
      })),
    ];

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
  fetch: async ({
    tokenId,
    page,
    witness = false,
  }: TransactionsFetchParams) => {
    set((state: TransactionsStore) => ({
      ...state,
      isLoading: true,
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

    // TODO: seems best to call the methods from the Actor directly
    // there's no need for the method wrappers
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

    // TODO: If a user request a page that is not the most recent
    // then the total transactions calculation will fail...
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
      // TODO: For totalTransactions/Pages Check TODO above,
      // as total transactions at time of writing
      // can only be computed on first page:None request...
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

export type NFTItemDetails = {
  [tokenContractId: string]: {
    [index: string]: NFTDetails,
  }
}

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

export type TokenStandards = 'ICPunks';

export const useDabStore = create<DabStore>((set, get) => ({
  isLoading: false,
  nftItemDetails: {},
  fetchDabItemDetails: async ({
    data,
    tokenId,
    standard,
  }: {
    data: any[],
    tokenId: string,
    standard: TokenStandards,
  }) => {
    // TODO: the call should be omitted, if already in cache
    const dabNFTMetadataPromises = data.map(
      (item) => getNFTDetails({
          tokenId,
          tokenIndex: item.item,
          standard,
        })
    );

    // TODO: Split into parts to accelerate availability to end user
    const dabNFTMetadataPromiseRes: NFTDetails[] = await Promise.all(dabNFTMetadataPromises);

    // let nftItemDetails: NFTItemDetails = get().nftItemDetails;

    const currNftItemDetails = dabNFTMetadataPromiseRes.reduce((acc, curr) => {
      acc[curr.canister] = {
        ...acc[curr.canister],
        [curr.index.toString()]: curr,
      };

      return acc;
    }, {} as NFTItemDetails);

    set({
      nftItemDetails: {
        ...get().nftItemDetails,
        ...currNftItemDetails,
      },
    })
  },
}));
