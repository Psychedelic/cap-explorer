import { generateRandomPrincipal } from '@psychedelic/generate-random-principal';
import { AccountData } from '@components/Tables/AccountsTable';

export const columns = [
  {
    Header: 'Canister',
    accessor: 'canister',
  },
];

const NUM_TO_GENERATE = 10;

export const generateData = (count: number = NUM_TO_GENERATE) => {

  const data: AccountData[] = [...new Array(count)].map(() => {
    const principal = generateRandomPrincipal();
    const accountData = {
      canister: principal.toText(),
    };

    return accountData;
  });

  return data;
}
