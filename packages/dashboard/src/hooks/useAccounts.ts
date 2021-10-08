import { useEffect, useState } from 'react';
import { Data } from '@components/Tables/AccountsTable';

export default () => {
  const [accountsData, setAccountsData] = useState<Data[]>([]);

  useEffect(() => {
    import('../utils/mocks/accountsMockData').then((module) => {
      // Mock short delay for loading state tests...
      setTimeout(() => {
        setAccountsData((module.data as Data[]));
      }, 400);
    });
  }, []);

  return accountsData;
};
