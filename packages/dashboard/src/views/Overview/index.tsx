import React, { useEffect } from 'react';
import AccountsTable from '@components/Tables/AccountsTable';
import Title from '@components/Title';
import Page, { PageRow } from '@components/Page';
import useAccounts from '@hooks/useAccounts';

const Overview = () => {
  const accountsData = useAccounts();

  return (
    <Page
      pageId="overview"
    >
      <PageRow>
        <Title size="xl">Cap Explorer</Title>
      </PageRow>
      <PageRow>
        <AccountsTable
          data={accountsData}
          id="overview-page-transactions"
        />
      </PageRow>
    </Page>
  );
};

export default Overview;
