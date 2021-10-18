/* eslint-disable import/prefer-default-export */
import create, { UseStore } from 'zustand';
import {
  cap,
  GetTransactionsResponseBorrowed as TransactionsResponse,
  Event as TransactionEvent,
} from '@psychedelic/cap-js';
import { Principal } from "@dfinity/principal";
import { parseGetTransactionsResponse } from '@utils/transactions';

interface AccountStore {
  accounts: string[],
  add: (account: string) => void,
}

export const useAccountStore: UseStore<AccountStore> = create((set) => (
  {
    accounts: [...new Set([])],
    add: (account: string) => set((state: AccountStore) => ({
      accounts: [...new Set([...state.accounts, account])],
    })),
  }
));

interface TransactionsFetchParams {
  tokenId: string,
  page?: number,
  witness: boolean,
}

interface TransactionsStore {
  transactionEvents: TransactionEvent[] | [],
  fetch: (params: TransactionsFetchParams) => void,
}

export const useTransactionStore: UseStore<TransactionsStore> = create((set) => ({
  transactionEvents: [...new Set([])],
  fetch: async ({
    tokenId,
    page,
    witness = false,
  }: TransactionsFetchParams) => {
    const response: TransactionsResponse = await cap.get_transactions({
      page,
      tokenId: Principal.fromText(tokenId),
      witness,
    });

    if (!response || !Array.isArray(response?.data) || !response?.data.length) {
      // TODO: What to do if no response? Handle gracefully

      return;
    }

    const parsedTransactionEvents = parseGetTransactionsResponse(response);

    set((state: TransactionsStore) => ({
      transactionEvents: [
        ...state.transactionEvents,
        parsedTransactionEvents,
      ],
    }));
  },
}));
