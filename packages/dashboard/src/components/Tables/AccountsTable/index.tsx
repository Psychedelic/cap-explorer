import React, { useState, useMemo, useEffect } from 'react';
import { styled } from '@stitched';
// TODO: move the FormatterTypes, Tableid to the util
import { FormatterTypes, TableId } from '@components/Tables/DataTable';
import { NamedAccountLink } from '@components/Link';
import { getDabMetadata, CanisterMetadata, DABCollection, DABCollectionItem } from '@utils/dab';
import { DabLink } from '@components/Link';
import ItemCell from '@components/ItemCell';
import { UnknownItemCell } from '@components/ItemCell';
import loadable from '@loadable/component';
import { LoadableLoadingPlaceholder } from '@components/LoadingForLoadable';

const LazyDatatable = loadable(() => import('@components/Tables/DataTable'), {
  // The fallback to blank is intentional
  // which transitions to the loader for slower internet connections
  fallback: <LoadableLoadingPlaceholder alt='Loading the Databable...' />,
});

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
    metadata?: DABCollectionItem,
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
  dabCollection,
}: {
  canisterId: string,
  dabCollection: DABCollection,
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

  console.log('[debug] AccountDab: identityInDab:', identityInDab);
  console.log('[debug] AccountDab: dabCollection:', dabCollection)

  return <span>Ok</span>;

  // return (
  //   <ItemCell
  //     identityInDab={identityInDab}
  //     derivedId={false}
  //     asHoverState={true}
  //   />
  // );
};

const AccountsTable = ({
  data = [],
  id,
  isLoading = false,
  dabCollection,
}: {
  // eslint-disable-next-line react/require-default-props
  data?: AccountData[],
  id: TableId,
  isLoading: boolean,
  dabCollection: DABCollection,
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
            <UnknownItemCell
              contractId={contractId}
              routeName='AppTransactions'
            >
              <AccountDab
                canisterId={contractId}
                dabCollection={dabCollection}
              />
            </UnknownItemCell>
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
      <LazyDatatable
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
