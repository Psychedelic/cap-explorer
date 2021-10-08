/* eslint-disable import/prefer-default-export */
import createPersistedState from 'use-persisted-state';

const bookmarkLocalStore = 'bookmark';

export const useBookmarkPersistedState = createPersistedState(bookmarkLocalStore);
