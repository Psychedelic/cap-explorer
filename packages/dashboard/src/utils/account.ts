/* eslint-disable import/prefer-default-export */
import {
  BookmarkColumnModes,
  isBookmarkColumnModeCollapsed,
} from '../components/BookmarkPanel';
import { Principal } from "@dfinity/principal";
import { AccountData } from '@components/Tables/AccountsTable';

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

  console.log('[debug] tokenContractsPairedRoots ', tokenContractsPairedRoots)

  return contracts
    .map((principal: Principal) => {
      const contractId = getTokenContractCanisterIdByRoot(
        tokenContractsPairedRoots,
        principal.toText(),
      )
      // TODO: this fall back is temporary used for dev only
      // since c3hjx-caaaa-aaaah-qcera-cai is missing at time of writing
      || principal.toText();

      console.log('[debug] contractId', contractId);

      return {
        contractId,
        // TODO: there's a call to Dab that requires
        // the canister id, so this should be handle a bit differently
        // but for now pass the canister id and the call to dab
        // is made in the scope of the datatable generation
        name: principal.toText(),
      }
    });
}

const getTokenContractCanisterIdByRoot = (
  tokenContractsPairedRoots: TokenContractsPairedRoots,
  rootCanisterId: string,
) => {
  if (!tokenContractsPairedRoots[rootCanisterId]) {
    console.warn(`Oops! Token contract not found for root ${rootCanisterId}` );
  }

  console.info('[debug] found ', tokenContractsPairedRoots[rootCanisterId])

  return tokenContractsPairedRoots[rootCanisterId];
}