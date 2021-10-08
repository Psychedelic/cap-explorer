/* eslint-disable import/prefer-default-export */
import create, { UseStore } from 'zustand';

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
