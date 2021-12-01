/* eslint-disable import/prefer-default-export */
import {
  BookmarkColumnModes,
  isBookmarkColumnModeCollapsed,
} from '../components/BookmarkPanel';
import { Principal } from "@dfinity/principal";
import { AccountData } from '@components/Tables/AccountsTable';
// import principal from './principal';
import { getDabMetadata, CanisterMetadata } from '@utils/dab';
import { preloadImage } from '@utils/images';

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
  let index = 0;
  const PRE_FETCH_DAB_INDEX_COUNT = 8

  for await (const rootContractPrincipal of contracts) {
    index += 1;

    const contractId = await getTokenContractCanisterIdByRoot(
      promisedTokenContractsPairedRoots,
      rootContractPrincipal.toText(),
    );

    if (!contractId) continue;

    // // Let's prefetch the very first few
    // // to provide the user with data ASAP
    // if (index <= PRE_FETCH_DAB_INDEX_COUNT) {
    //   // Fetch Dab metadata
    //   const metadata = await getDabMetadata({
    //     canisterId: contractId,
    //   });

    //   data.push({
    //     contractId,
    //     dabCanister: {
    //       contractId,
    //       metadata,
    //     },
    //   });

    //   continue;
    // }

    data.push({
      contractId,
      dabCanister: {
        contractId,
      },
    });
  }

  // Preload the first top images
  // controlled by the value set in PRE_FETCH_DAB_INDEX_COUNT
  let promises: any = [];

  for (let i = 0; i <= PRE_FETCH_DAB_INDEX_COUNT; i++) {
    if (!data[i]?.dabCanister?.metadata?.logo_url) continue;

    promises.push(
      preloadImage(data[i]?.dabCanister?.metadata?.logo_url as any)
    );
  }

  const result = await Promise.all(promises);

  console.warn(`Nice! Preloaded ${result.length} images.`);

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