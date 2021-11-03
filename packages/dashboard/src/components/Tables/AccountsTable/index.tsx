import React, { useState, useMemo, useEffect } from 'react';
import { styled } from '@stitched';
import DataTable, { FormatterTypes, TableId } from '@components/Tables/DataTable';
import Title from '@components/Title';
import { AccountLink, NamedLink } from '@components/Link';
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
  canister: string,
  name: string,
}

interface Column {
  Header: string,
  accessor: keyof AccountData
}

export const DEFAULT_COLUMN_ORDER: (keyof AccountData)[] = [
  'name',
  'canister',
];

const columns: Column[] = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Canister ID',
    accessor: 'canister',
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
          : <NamedLink account={canisterId} name='Unknown to DAB' />
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
      canister: (cellValue: string) => <AccountLink account={cellValue} trim={false} />,
      name: (cellValue: string) => <AccountDab canisterId={cellValue} />,
    },
  } as FormatterTypes), []);

  return (
    <Container
      data-id={id}
    >
      <Title size="ml">Token Contracts</Title>

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
