/* eslint-disable import/prefer-default-export */
import {
  BookmarkColumnModes,
  isBookmarkColumnModeCollapsed,
} from '../components/BookmarkPanel';
import { Principal } from "@dfinity/principal";
import { AccountData as AccountData } from '@components/Tables/AccountsTable';

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

export const parseUserRootBucketsResponse = ({
  contracts,
}: {
  contracts?: Principal[],
}): AccountData[] | [] => {
  if (!contracts || !Array.isArray(contracts) || !contracts.length) return [];

  return contracts
    .map((principal: Principal) => ({
      canister: principal.toText(),
      transactions: undefined,
      age: undefined,
    }));
}
