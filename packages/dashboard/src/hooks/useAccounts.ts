import { useEffect, useState } from 'react';
import { AccountData } from '@components/Tables/AccountsTable';
import { cap } from '@psychedelic/cap-js';
import { parseUserRootBucketsResponse } from '@utils/account';
import { Principal } from "@dfinity/principal";

export default () => {
  const [accountsData, setAccountsData] = useState<AccountData[]>([]);

  useEffect(() => {
    const getAllTokenContracts = async () => {
      const response = await cap.get_user_root_buckets({
        user: "aaaaa-aa",
        witness: false,
      });

      if (!response || !Array.isArray(response?.contracts) || !response?.contracts.length) {
        // TODO: What to do if no response? Handle gracefully

        return;
      }

      setAccountsData(
        parseUserRootBucketsResponse(response),
      );
    };

    getAllTokenContracts();
  }, []);

  return accountsData;
};
