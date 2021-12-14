import {
  GetTransactionsResponseBorrowed as TransactionsResponse,
  Event as TransactionEvent,
  CapRoot,
} from '@psychedelic/cap-js';
import create from 'zustand';
import { USE_MOCKUP, PAGE_SIZE, MIN_PAGE_NUMBER } from './index';
import { getCapRootInstance } from '@utils/cap';
import { parseGetTransactionsResponse } from '@utils/transactions';
import config from '../../config';

export interface TransactionsStore {
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
  page: number | undefined,
  pageData: TransactionEvent[] | undefined,
  transactionEvents: TransactionEvent[] | [],
  totalTransactions: number,
  totalPages: number,
  fetch: (params: TransactionsFetchParams) => void,
  reset: () => void,
}

export interface TransactionsFetchParams {
  tokenId: string,
  page?: number,
  witness: boolean,
}

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
        // TODO: the set function merges state
        // there seems to be no need to spread the data
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
        // TODO: the set function merges state
        // there seems to be no need to spread the data
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
