import {
  Event as TransactionEvent,
} from '@psychedelic/cap-js';
import { prettifyCapTransactions } from '@psychedelic/cap-js'
import { Principal } from '@dfinity/principal';

export default {};

interface Transaction extends Omit<TransactionEvent, 'to' | 'from' | 'caller' | 'operation' | 'time'> {
  to: string;
  from: string;
  caller: string;
  operation: string;
  time?: string;
}

export const toTransactionTime = (time: bigint) => {
  if (typeof time !== 'bigint') return;

  let ISOString;

  try {
    ISOString = new Date(Number(time))?.toISOString();
  } catch (err) {
    console.warn(err);
    return;
  };

  const dateChunks = ISOString.split('T')[0].split('-');
  const formated = `${dateChunks[2]}/${dateChunks[1]}/${dateChunks[0]}`;

  return formated;
}

type TransactionDetails = {
  fee: bigint;
  from: Principal;
  to: Principal;
  amount: bigint;
  memo: bigint;
}

export const parseGetTransactionsResponse = ({
  data,
}: {
  data?: TransactionEvent[],
}): Transaction[] | [] => {
  if (!data || !Array.isArray(data) || !data.length) return [];

  return data.map(v => {
    const { details } = prettifyCapTransactions(v);

    // TODO: validate details

    return {
      ...v,
      to: (details as unknown as TransactionDetails)?.to?.toText(),
      from: (details as unknown as TransactionDetails)?.from?.toText(),
      fee: (details as unknown as TransactionDetails)?.fee,
      amount: (details as unknown as TransactionDetails)?.amount,
      memo: (details as unknown as TransactionDetails)?.memo,
      caller: v.caller.toText(),
      operation: v.operation,
      time: toTransactionTime(v.time),
    }
  })
  // Reverse the order
  // because the natural order that the data is presented
  // from the response, is at the very top
  // showing the oldest transaction in the page
  .reverse();
}
