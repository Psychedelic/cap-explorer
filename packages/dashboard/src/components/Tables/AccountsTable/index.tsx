import React, { useState, useMemo, useEffect } from 'react';
import { styled } from '@stitched';
import DataTable, { FormatterTypes, TableId } from '@components/Tables/DataTable';
import { NamedAccountLink } from '@components/Link';
import { getDabMetadata, CanisterMetadata } from '@utils/dab';
import IdentityDab from '@components/IdentityDab';
import { DabLink } from '@components/Link';
import Loading from '@components/Loading';
import ItemCell from '@components/ItemCell';

const Container = styled('div', {
  fontSize: '$s',
  fontFamily: 'Inter',
  lineHeight: '$normal',
  color: '$defaultTxtColour',

  '& [data-table] [data-scrollable] > div': {
    gridTemplateColumns: '0.75fr 1fr',
    gridTemplateAreas: '"name canister"',
    alignItems: 'center',
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

const LoadingContainer = styled('div', {
  display: 'inline-block',
  position: 'relative',
  width: '20px',
  height: '20px',
  verticalAlign: 'middle',
});

export interface AccountData {
  contractId: string,
  dabCanisterId: string,
}

interface Column {
  Header: string,
  accessor: keyof AccountData
}

export const DEFAULT_COLUMN_ORDER: (keyof AccountData)[] = [
  'dabCanisterId',
  'contractId',
];

const columns: Column[] = [
  {
    Header: 'Name',
    accessor: 'dabCanisterId',
  },
  {
    Header: 'Token Canister ID',
    accessor: 'contractId',
  },
];

const AccountDab = ({
  canisterId,
}: {
  canisterId: string,
}) => {
  const [identityInDab, setIdentityInDab] = useState<CanisterMetadata>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dab metadata handler
  useEffect(() => {
    // TODO: Should this move to the store?
    // at the moment is called as a "nice-to-have",
    // not as main business logic...
    const getDabMetadataHandler = async () => {
      const metadata = await getDabMetadata({
        canisterId,
      });

      if (!metadata) {
        setIsLoading(false);

        return;
      }

      // TODO: Update name column, otherwise fallback
      setIdentityInDab({
        ...metadata,
      });

      setIsLoading(false);
    };

    getDabMetadataHandler();
  }, []);

  return (
    <ItemCell
      identityInDab={identityInDab}
      derivedId={false}
    />
  );
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
      contractId: (cellValue: string) => <NamedAccountLink name={cellValue} account={cellValue} />,
      dabCanisterId: (cellValue: string) => (
        <DabLink tokenContractId={cellValue}>
          <AccountDab canisterId={cellValue} />
        </DabLink>
      ),
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
