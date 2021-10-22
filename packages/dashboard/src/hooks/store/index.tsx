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

export type Store = UseStore<AccountStore>;

export interface AccountStore {
  accounts: ContractsResponse | {},
  pageData: AccountData[],
  totalContracts: number,
  totalPages: number,
  fetch: ({ capRouterInstance }: { capRouterInstance: CapRouter } ) => void,
  reset: () => void,
}

export type UseAccountStore = () => Promise<UseStore<AccountStore>>;

export const useAccountStore = create<AccountStore>((set) => ({
  accounts: {},
  pageData: [],
  totalContracts: 0,
  totalPages: 0,
  fetch: async ({
    // CapRouter has App lifetime, as such
    // should be passed from App top-level
    capRouterInstance,
  }) => {
    // Shall use mockup data?
    if (process.env.MOCKUP) {
      import('../../utils/mocks/accountsMockData').then((module) => {
        const pageData =  module.generateData();

        // Mock short delay for loading state tests...
        setTimeout(() => {
          set((state: AccountStore) => ({
            accounts: {},
            pageData,
            totalContracts: pageData.length,
            totalPages: 1,
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

      return;
    }

    const pageData = parseUserRootBucketsResponse(response);

    set((state: AccountStore) => ({
      accounts: response,
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
  pageData: TransactionEvent[] | [],
  transactionEvents: TransactionEvent[] | [],
  totalTransactions: number,
  totalPages: number,
  fetch: (params: TransactionsFetchParams) => void,
  reset: () => void,
}

export const PAGE_SIZE = 64;

export const useTransactionStore = create<TransactionsStore>((set) => ({
  pageData: [],
  transactionEvents: [],
  totalTransactions: 0,
  totalPages: 0,
  fetch: async ({
    tokenId,
    page,
    witness = false,
  }: TransactionsFetchParams) => {
    // Shall use mockup data?
    if (process.env.MOCKUP) {
      import('../../utils/mocks/transactionsTableMockData').then((module) => {
        const pageData =  module.generateData();
        const totalTransactions = PAGE_SIZE * 1 + pageData.length;
        const totalPages = Math.ceil(totalTransactions > PAGE_SIZE ? totalTransactions / PAGE_SIZE : 1);
        
        // Mock short delay for loading state tests...
        setTimeout(() => {
          set((state: TransactionsStore) => ({
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

      return;
    }

    // TODO: If a user request a page that is not the most recent
    // then the total transactions calculation will fail...
    const totalTransactions = PAGE_SIZE * response.page + response.data.length;
    const totalPages = totalTransactions > PAGE_SIZE ? totalTransactions / PAGE_SIZE : 1;
    const pageData = parseGetTransactionsResponse(response);

    set((state: TransactionsStore) => ({
      pageData,
      transactionEvents: [
        ...state.transactionEvents,
        pageData,
      ],
      // TODO: For totalTransactions/Pages Check TODO above,
      // as total transactions at time of writing
      // can only be computed on first page:None request...
      totalTransactions,
      totalPages: Math.max(state.totalPages, totalPages),
    }));
  },
  reset: () => set((state: TransactionsStore) => ({
    pageData: [],
    transactionEvents: [],
    totalTransactions: 0,
    totalPages: 0,
  })),
}));
