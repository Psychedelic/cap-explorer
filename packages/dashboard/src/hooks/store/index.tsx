import { shouldUseMockup } from '@utils/mocks';

export {
  useTransactionStore
} from './TransactionStore';
export type {
  TransactionsStore,
} from './TransactionStore'

export {
  useAccountStore,
} from './AccountStore';
export type { 
 AccountStore,
} from './AccountStore';

export {
  useDabStore,
} from './DabStore';
export type {
  DabStore,
} from './DabStore';

// Shall use mockup data?
export const USE_MOCKUP = shouldUseMockup();
export const PAGE_SIZE = 64;
export const MIN_PAGE_NUMBER = 1;

