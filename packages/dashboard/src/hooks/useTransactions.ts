import { useEffect, useState } from 'react';
import { Data } from '@components/Tables/TransactionsTable';

export default () => {
  const [transactionsData, setTransactionsData] = useState<Data[]>([]);

  useEffect(() => {
    import('../utils/mocks/transactionsTableMockData').then((module) => {
      // Mock short delay for loading state tests...
      setTimeout(() => {
        setTransactionsData((module.data as Data[]));
      }, 400);
    });
  }, []);

  return transactionsData;
};
