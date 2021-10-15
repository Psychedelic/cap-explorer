import { useEffect, useState } from 'react';
import { Data } from '@components/Tables/TransactionsTable';
import { Principal } from "@dfinity/principal";
import {
  cap,
  GetTransactionsResponseBorrowed as TransactionsResponse,
  Event as TransactionEvent,
} from '@psychedelic/cap-js';
import {
  useParams
} from "react-router-dom";
import { parseGetTransactionsResponse } from '@utils/transactions';

export default () => {
  const [transactionsData, setTransactionsData] = useState<TransactionEvent[]>([]);
  let { id: tokenId } = useParams() as { id: string };

  useEffect(() => {
    const getTransactionsHandler = async () => {
      const response: TransactionsResponse = await cap.get_transactions({
        tokenId: Principal.fromText(tokenId),
        witness: false,
        page: 0,
      });

      if (!response || !Array.isArray(response?.data) || !response?.data.length) {
        // TODO: What to do if no response? Handle gracefully

        return;
      }

      setTransactionsData(
        parseGetTransactionsResponse(response),
      );
    };

    getTransactionsHandler();
  }, []);

  return transactionsData;
};
