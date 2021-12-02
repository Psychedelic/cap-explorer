import React, { useState, useMemo, useEffect } from 'react';
import { styled } from '@stitched';
import DataTable, { FormatterTypes, TableId } from '@components/Tables/DataTable';
import { NamedAccountLink } from '@components/Link';
import { getDabMetadata, CanisterMetadata } from '@utils/dab';
import { DabLink } from '@components/Link';
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

export interface AccountData {
  contractId: string,
  dabCanister: {
    contractId: string,
    metadata?: CanisterMetadata,
  },
}

interface Column {
  Header: string,
  accessor: keyof AccountData
}

export const DEFAULT_COLUMN_ORDER: (keyof AccountData)[] = [
  'dabCanister',
  'contractId',
];

const columns: Column[] = [
  {
    Header: 'Name',
    accessor: 'dabCanister',
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
      asHoverState={true}
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
      dabCanister: ({
        contractId,
        metadata,
      }: {
        contractId: string,
        metadata?: CanisterMetadata,
      }) => {
        if (!metadata) {
          // Request the Dab metadata
          // because we only fetch the very first ones to improve perf
          // and serve the client ASAP
          return (
            // TODO: Disabled for debugging should remove the commented out
            // <DabLink tokenContractId={contractId}>
            //   <AccountDab canisterId={contractId} />
            // </DabLink>
            <AccountDab canisterId={contractId} />
          )
        }

        return (
          <DabLink tokenContractId={contractId}>
            <ItemCell
              identityInDab={metadata}
              // Overview page does not requires it
              derivedId={false}
              asHoverState={true}
            />
          </DabLink>
        );
      }
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
