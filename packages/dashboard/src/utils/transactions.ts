import { Event as TransactionEvent } from '@psychedelic/cap-js';

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

const toOperationTerm = (operation: Record<string, string>) => {
  let term = 'n/a';

  try {
    term = Object.keys(operation)[0]
  } catch (err) {};

  return term;
};

export const parseGetTransactionsResponse = ({
  data,
}: {
  data?: TransactionEvent[],
}): Transaction[] | [] => {
  if (!data || !Array.isArray(data) || !data.length) return [];

  return data.map(v => ({
    ...v,
    to: v.to.toText(),
    from: v?.from?.pop()?.toText() as string,
    caller: v.caller.toText(),
    operation: toOperationTerm(v.operation),
    time: toTransactionTime(v.time),
  }));
}
