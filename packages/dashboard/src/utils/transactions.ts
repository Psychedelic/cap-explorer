import {
  Event as TransactionEvent,
} from '@psychedelic/cap-js';
import { prettifyCapTransactions } from '@psychedelic/cap-js'
import { Principal } from '@dfinity/principal';
import { decodeTokenId } from '@utils/token';

export default {};

interface Transaction extends Omit<TransactionEvent, 'to' | 'from' | 'caller' | 'operation' | 'time'> {
  item: number,
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

  return ISOString;
}

type TransactionDetails = {
  from: Principal;
  to: Principal;
  amount: bigint;
  token?: string;
  tokenId?: string;
  token_id?: string;
}

type TokenField = 'token' | 'token_id' | 'tokenId';
type TokenFields = TokenField[];

export const parseGetTransactionsResponse = ({
  data,
}: {
  data?: TransactionEvent[],
}): Transaction[] | [] => {
  if (!data || !Array.isArray(data) || !data.length) return [];

  return data.map(v => {
    const { details } = prettifyCapTransactions(v);

    // TODO: validate details

    // TODO: there are no conventions on naming fields
    // so, for the moment will check for matching token
    const possibleFields: TokenFields = ['token', 'token_id', 'tokenId'];
    const tokenField = possibleFields.find((field) => details[field]);

    const itemHandler = (details: TransactionDetails, tokenField: TokenField) => {      
      let tokenIndex: number | undefined;

      if (typeof details?.token_id === 'bigint') {
        return details.token_id;
      }

      try {
        const tokenIdText = details[tokenField];
      
        if (!tokenIdText) throw Error('Oops! Token field not found');

        tokenIndex = decodeTokenId(tokenIdText);

        if (!tokenIndex) throw Error('Oops! Not a valid tokenIndex');
      } catch (err) {
        console.warn(err);
      }

      return tokenIndex;
    };

    return {
      ...v,
      item: tokenField
            ? itemHandler(
              (details as unknown as TransactionDetails),
              tokenField,
            )
            : undefined,
      to: (details as unknown as TransactionDetails)?.to?.toText(),
      from: (details as unknown as TransactionDetails)?.from?.toText(),
      amount: (details as unknown as TransactionDetails)?.amount,
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
