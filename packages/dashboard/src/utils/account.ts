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

export type PromiseTokenContractsPairedRoots = Record<string, Promise<string | undefined>>;

export type tokenContractsPairedRoots = Record<string, string>;

export const parseUserRootBucketsResponse = async ({
  contracts,
  promisedTokenContractsPairedRoots,
}: {
  contracts?: Principal[],
  promisedTokenContractsPairedRoots: PromiseTokenContractsPairedRoots,
}): Promise<AccountData[] | []> => {
  if (!contracts || !Array.isArray(contracts) || !contracts.length) return [];

  let data: AccountData[] = [];

  for await (const rootContractPrincipal of contracts) {
    const contractId = await getTokenContractCanisterIdByRoot(
      promisedTokenContractsPairedRoots,
      rootContractPrincipal.toText(),
    );

    if (!contractId) continue;

    data.push({
      contractId,
      // rootCanisterId: rootContractPrincipal.toText(),
      // TODO: should rename `rootCanisterId` to `dabCanisterId`
      dabCanisterId: contractId,
    });
  }

  return data;
}

export const getTokenContractCanisterIdByRoot = (
  promisedTokenContractsPairedRoots: PromiseTokenContractsPairedRoots,
  rootCanisterId: string,
): Promise<string | undefined> => {
  if (!promisedTokenContractsPairedRoots[rootCanisterId]) {
    console.warn(`Oops! Token contract not found for root ${rootCanisterId}, omitted.` );

    return (async () => undefined)();
  }

  return promisedTokenContractsPairedRoots[rootCanisterId];
}