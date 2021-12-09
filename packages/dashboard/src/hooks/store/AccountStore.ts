import create from 'zustand';
import { AccountData } from '@components/Tables/AccountsTable';
import {
  GetUserRootBucketsResponse as ContractsResponse,
  CapRouter,
  CapRoot,
} from '@psychedelic/cap-js';
import {
  CanisterKeyPairedMetadata,
  CanisterNameKeyPairedId,
  ContractKeyPairedMetadata,
  DABCollectionItem,
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
import { DabStore } from './DabStore';

export interface AccountStore {
  accounts: ContractsResponse | {},
  canisterKeyPairedMetadata?: CanisterKeyPairedMetadata,
  canisterNameKeyPairedId: CanisterNameKeyPairedId,
  contractKeyPairedMetadata: ContractKeyPairedMetadata,
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
  pageData: AccountData[],
  totalContracts: number,
  totalPages: number,
  fetch: ({
    capRouterInstance,
    dabStore,
  }: {
    capRouterInstance: CapRouter,
    dabStore: DabStore,
  } ) => void,
  reset: () => void,
}

export const useAccountStore = create<AccountStore>((set, get) => ({
  accounts: {},
  canisterKeyPairedMetadata: {},
  canisterNameKeyPairedId: {},
  contractPairedMetadata: [],
  contractKeyPairedMetadata: {},
  isLoading: false,
  setIsLoading: async(isLoading) => set({ isLoading }),
  pageData: [],
  totalContracts: 0,
  totalPages: 0,
  fetch: async ({
    // CapRouter has App lifetime, as such
    // should be passed from App top-level
    capRouterInstance,
    dabStore,
  }) => {
    set({
      isLoading: true,
    });

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
      set({
        isLoading: false,
      });

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
    const { fetchDabCollection } = dabStore;

    // TODO: invesitgate why the Dab collection which
    // is returned by the service returns `timestamp`
    // which seems that dab-js is missing it and should be updated
    const dabCollection = await fetchDabCollection();

    const contractKeyPairedMetadata = dabCollection?.reduce((acc, curr) => {
      acc[curr?.principal_id?.toString()] = curr;
      return acc;
    }, {} as Record<string, DABCollectionItem>);

    pageData = pageData.map(({ contractId, dabCanister }: AccountData) => {
      return ({
        contractId,
        dabCanister: {
          ...dabCanister,
          metadata: contractKeyPairedMetadata?.[contractId],
        }
      })
    });

    // Loading first few images only inadvance...
    // TODO: Maybe renaming this or the fn signature
    // to include the amount to preload to make it more readable
    await preloadPageDataImages({ pageData });

    const canisterNameKeyPairedId = 
      Object
        .keys(contractKeyPairedMetadata)
        .reduce((acc, curr) => {
        return {
          ...acc,
          [contractKeyPairedMetadata[curr].name]: curr,
        }
      }, {} as { [name: string]: string });

    set((state: AccountStore) => ({
      accounts: response,
      canisterNameKeyPairedId,
      contractKeyPairedMetadata,
      isLoading: false,
      pageData,
      totalContracts: pageData.length,
      totalPages: 1,
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
