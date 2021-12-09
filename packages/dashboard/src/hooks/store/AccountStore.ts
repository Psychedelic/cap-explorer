import create from 'zustand';
import { AccountData } from '@components/Tables/AccountsTable';
import {
  GetUserRootBucketsResponse as ContractsResponse,
  CapRouter,
  CapRoot,
} from '@psychedelic/cap-js';
import {
  CanisterMetadata,
  CanisterKeyPairedMetadata,
  CanisterNameKeyPairedId,
  ContractPairedMetadata,
  ContractKeyPairedMetadata,
  getDabMetadata,
} from '@utils/dab';
import { USE_MOCKUP } from './index';
import { getCapRootInstance } from '@utils/cap';
import { parseUserRootBucketsResponse } from '@utils/account';
import { managementCanisterPrincipal } from '@utils/ic-management-api';
import config from '../../config';
import { Principal } from '@dfinity/principal';
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
      // TODO: the set function merges state
      // there seems to be no need to spread the data
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
        // TODO: the set function merges state
        // there seems to be no need to spread the data
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
  // TODO: should use the following instead
  // when possible please test and move
  // reset: () => () => set({}, true),
}));
