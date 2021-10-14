import { useEffect, useState } from 'react';
import { Data } from '@components/Tables/AccountsTable';
import { cap } from '@psychedelic/cap-js';
import { Principal } from "@dfinity/principal";

export default () => {
  const [accountsData, setAccountsData] = useState<Data[]>([]);

  useEffect(() => {
    const getAllTokenContracts = async () => {
      const { contracts: contractPrincipalList } = await cap.get_user_root_buckets({
        user: "aaaaa-aa",
        witness: false,
      });
      console.log('[debug] contractPrincipalList: ', contractPrincipalList);
      const contracts = contractPrincipalList
                          .map((principal: Principal) => principal.toText())
      console.log('[debug] contracts: ', contracts);
    };

    getAllTokenContracts();

    import('@utils/mocks/accountsMockData').then((module) => {
      // Mock short delay for loading state tests...
      setTimeout(() => {
        setAccountsData((module.data as Data[]));
      }, 400);
    });
  }, []);

  return accountsData;
};
