import React, { useState, useMemo, useEffect } from 'react';
import { styled } from '@stitched';
import DataTable, { FormatterTypes, TableId } from '@components/Tables/DataTable';
import Title from '@components/Title';
import { AccountLink, NamedAccountLink } from '@components/Link';
import { getDabMetadata, CanisterMetadata } from '@utils/dab';
import IdentityDab from '@components/IdentityDab';

const Container = styled('div', {
  fontSize: '$s',
  fontFamily: 'Inter',
  lineHeight: '$normal',
  color: '$defaultTxtColour',

  '& [data-table] [data-scrollable] > div': {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateAreas: '"name canister"',
  },

  '& [data-cid]': {
    justifySelf: 'left',
  },

  '& div': {
    lineHeight: 'inherit',
  },

  '& h1': {
    marginBottom: '20px',
  },
});

export interface AccountData {
  contractId: string,
  rootCanisterId: string,
}

interface Column {
  Header: string,
  accessor: keyof AccountData
}

export const DEFAULT_COLUMN_ORDER: (keyof AccountData)[] = [
  'rootCanisterId',
  'contractId',
];

const columns: Column[] = [
  {
    Header: 'Name',
    accessor: 'rootCanisterId',
  },
  {
    Header: 'Token contract',
    accessor: 'contractId',
  },
];

const AccountDab = ({
  canisterId,
}: {
  canisterId: string,
}) => {
  const [identityInDab, setIdentityInDab] = useState<CanisterMetadata>();

  // Dab metadata handler
  useEffect(() => {
    // TODO: Should this move to the store?
    // at the moment is called as a "nice-to-have",
    // not as main business logic...
    const getDabMetadataHandler = async () => {
      const metadata = await getDabMetadata({
        canisterId,
      });

      if (!metadata) return;

      // TODO: Update name column, otherwise fallback
      setIdentityInDab({
        ...metadata,
      });
    };

    getDabMetadataHandler();
  }, []);

  return identityInDab
          ? <IdentityDab name={identityInDab?.name} image={identityInDab?.logo_url} />
          : <NamedAccountLink name='Unnamed' account={canisterId} />
};

const AccountsTable = ({
  data = [],
  id,
  isLoading = false,
}: {
  // eslint-disable-next-line react/require-default-props
  data?: AccountData[],
  id: TableId,
  isLoading: boolean,
}) => {
  const formatters = useMemo(() => ({
    body: {
      contractId: (cellValue: string) => {
        const found = data.find((x) => x.contractId === cellValue);

        if (!found?.rootCanisterId) return '';

        return <NamedAccountLink name={cellValue} account={found.rootCanisterId} />;
      },
      rootCanisterId: (cellValue: string) => <AccountDab canisterId={cellValue} />,
    },
  } as FormatterTypes), [data]);

  return (
    <Container
      data-id={id}
    >
      <DataTable
        columns={columns}
        data={data}
        formatters={formatters}
        columnOrder={DEFAULT_COLUMN_ORDER}
        isLoading={isLoading}
        // TODO: Accounts table page count and fetch handling
        pageCount={1}
        fetchPageDataHandler={() => null}
      />
    </Container>
  );
};

export default AccountsTable;
