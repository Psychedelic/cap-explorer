/* eslint-disable import/prefer-default-export */
import {
  BookmarkColumnModes,
  isBookmarkColumnModeCollapsed,
} from '../components/BookmarkPanel';
import { Principal } from "@dfinity/principal";
import { AccountData } from '@components/Tables/AccountsTable';
// import principal from './principal';

export const hashTrimmer = (hash: string) => {
  const size = 6;

  if (hash.length - 1 < size * 2) return '';

  const chunk1 = hash.substring(0, size);
  const chunk2 = hash.substring(hash.length - size);

  return `${chunk1}...${chunk2}`;
};

export const trimAccount = (account: string) => {
  const data = (account && account.split('-')) ?? [];

  // Uses fallback to hashtrimmer
  // that was used with mocked data
  // which can be removed in the future
  if (!data.length || data.length === 1) return hashTrimmer(account);

  return `${data[0]}...${data[data.length - 1]}`;
};

export type BookmarkExpandHandler = (args?: BookmarkExpandHandlerOverrides) => void;

interface BookmarkExpandHandlerOverrides {
  isCollapsed?: boolean,
}

export const createBookmarkExpandHandler = ({
  bookmarkColumnMode,
  setBookmarkColumnMode,
}: {
  bookmarkColumnMode: BookmarkColumnModes,
  setBookmarkColumnMode: (mode: BookmarkColumnModes) => void,
}) => {
  const bookmarkExpandHandler: BookmarkExpandHandler = (overrides) => {
    setBookmarkColumnMode(
      overrides?.isCollapsed
      || isBookmarkColumnModeCollapsed(bookmarkColumnMode)
        ? BookmarkColumnModes.expanded
        : BookmarkColumnModes.collapsed,
    );
  };
  return bookmarkExpandHandler;
};

type TokenContractsPairedRoots = Record<string, string>;

export const parseUserRootBucketsResponse = ({
  contracts,
  tokenContractsPairedRoots,
}: {
  contracts?: Principal[],
  tokenContractsPairedRoots: TokenContractsPairedRoots,
}): AccountData[] | [] => {
  if (!contracts || !Array.isArray(contracts) || !contracts.length) return [];

  return contracts
    .filter(
      (principal: Principal) =>  getTokenContractCanisterIdByRoot(
        tokenContractsPairedRoots,
        principal.toText(),
      )
    )
    .map((principal: Principal) => {
      const rootCanisterId = principal.toText();
      const contractId = getTokenContractCanisterIdByRoot(
        tokenContractsPairedRoots,
        rootCanisterId,
      ) as string;

      return {
        contractId,
        rootCanisterId,
      }
    });
}

export const getTokenContractCanisterIdByRoot = (
  tokenContractsPairedRoots: TokenContractsPairedRoots,
  rootCanisterId: string,
) => {
  if (!tokenContractsPairedRoots[rootCanisterId]) {
    console.warn(`Oops! Token contract not found for root ${rootCanisterId}, omitted.` );

    return false;
  }

  return tokenContractsPairedRoots[rootCanisterId];
}