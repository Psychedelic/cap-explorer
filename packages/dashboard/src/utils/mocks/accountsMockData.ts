import { generateRandomPrincipal } from '@psychedelic/generate-random-principal';
import { AccountData } from '@components/Tables/AccountsTable';

export const columns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Canister',
    accessor: 'contractId',
  },
];

const NUM_TO_GENERATE = 10;

export const generateData = (count: number = NUM_TO_GENERATE) => {
  // TODO: contract id was introduced
  // this needs to be refactored at some point
  const data: AccountData[] = [...new Array(count)].map(() => {
    const principal = generateRandomPrincipal();
    const accountData = {
      contractId: principal.toText(),
      name: 'CanisterX'
    };

    return accountData;
  });

  return data;
}
