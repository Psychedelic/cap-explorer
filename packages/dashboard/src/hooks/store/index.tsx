/* eslint-disable import/prefer-default-export */
import create, { UseStore } from 'zustand';
import {
  GetTransactionsResponseBorrowed as TransactionsResponse,
  Event as TransactionEvent,
  GetUserRootBucketsResponse as ContractsResponse,
  CapRouter,
  CapRoot,
} from '@psychedelic/cap-js';
import { getCapRootInstance } from '@utils/cap'; 
import { parseGetTransactionsResponse } from '@utils/transactions';
import { parseUserRootBucketsResponse } from '@utils/account';
import { managementCanisterPrincipal } from '@utils/ic-management-api';
import { AccountData } from '@components/Tables/AccountsTable';
import config from '../../config';
import { shouldUseMockup } from '../../utils/mocks';
import { trimEnd } from 'lodash';

export type Store = UseStore<AccountStore>;

export interface AccountStore {
  accounts: ContractsResponse | {},
  isLoading: boolean,
  pageData: AccountData[],
  totalContracts: number,
  totalPages: number,
  fetch: ({ capRouterInstance }: { capRouterInstance: CapRouter } ) => void,
  reset: () => void,
}

export type UseAccountStore = () => Promise<UseStore<AccountStore>>;

// Shall use mockup data?
const USE_MOCKUP = shouldUseMockup();

export const useAccountStore = create<AccountStore>((set) => ({
  accounts: {},
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
    const response = await capRouterInstance.get_user_root_buckets({
      user: managementCanisterPrincipal,
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

    const pageData = parseUserRootBucketsResponse(response);

    set((state: AccountStore) => ({
      accounts: response,
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
}));

interface TransactionsFetchParams {
  tokenId: string,
  page?: number,
  witness: boolean,
}

export interface TransactionsStore {
  isLoading: boolean,
  pageData: TransactionEvent[] | [],
  transactionEvents: TransactionEvent[] | [],
  totalTransactions: number,
  totalPages: number,
  fetch: (params: TransactionsFetchParams) => void,
  reset: () => void,
}

export const PAGE_SIZE = 64;

const MIN_PAGE_NUMBER = 1;

export const useTransactionStore = create<TransactionsStore>((set) => ({
  pageData: [],
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
      }));

      return;
    }

    // TODO: If a user request a page that is not the most recent
    // then the total transactions calculation will fail...
    const totalTransactions = PAGE_SIZE * response.page + response.data.length;
    
    console.log('[debug]', {
      responsePage: response.page,
      responseDataLength: response.data.length,
    });
    console.log('[debug] totalTransactions ', totalTransactions);

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
      totalTransactions,
      totalPages: getTotalPages(state.totalPages),
    }));
  },
  reset: () => set((state: TransactionsStore) => ({
    pageData: [],
    transactionEvents: [],
    totalTransactions: 0,
    totalPages: 0,
  })),
}));
