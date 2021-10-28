import { generateRandomPrincipal } from '@psychedelic/generate-random-principal';
import dayjs from 'dayjs'
import dayjsRandom from 'dayjs-random';
import { Event as TransactionEvent } from '@psychedelic/cap-js';

dayjs.extend(dayjsRandom)

export const columns = [
  {
    Header: 'Operation',
    accessor: 'operation',
  },
  {
    Header: 'Caller',
    accessor: 'caller',
  },
  {
    Header: 'From',
    accessor: 'from',
  },
  {
    Header: 'To',
    accessor: 'to',
  },
  {
    Header: 'Time',
    accessor: 'time',
  },
  {
    Header: 'Memo',
    accessor: 'memo',
  },
  {
    Header: 'Fee',
    accessor: 'fee',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
  },
];

const NUM_TO_GENERATE = 100;

export const generateData = (count: number = NUM_TO_GENERATE) => {
  const data: TransactionEvent[] = [...new Array(NUM_TO_GENERATE)].map(() => {
    const caller = generateRandomPrincipal().toText();
    const from = generateRandomPrincipal().toText();
    const to = generateRandomPrincipal().toText();

    return {
      operation: 'deposit',
      caller,
      from,
      to,
      time: (dayjs as any).between('2020-01-01', '2021-10-01').format('DD/MM/YYYY'),
      memo: 2142,
      amount: 484,
      fee: 50,
    }
  });

  return data;
}
