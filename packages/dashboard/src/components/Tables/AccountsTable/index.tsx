import React, { useState, useMemo, useEffect } from 'react';
import { styled } from '@stitched';
import DataTable, { FormatterTypes, TableId } from '@components/Tables/DataTable';
import Title from '@components/Title';
import { dateRelative } from '@utils/date';
import { formattedTransactionNumber } from '@utils/formatters';
import { isTableDataReady } from '@utils/tables';
import { AccountLink } from '@components/Link';
import ValueCell from '@components/Tables/ValueCell';

const Container = styled('div', {
  fontSize: '$s',
  fontFamily: 'Inter',
  lineHeight: '$normal',
  color: '$defaultTxtColour',

  '& [data-table] [data-scrollable] > div': {
    gridTemplateColumns: '2fr 1fr 1fr',
    gridTemplateAreas: '"canister transactions age"',
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
  transactions?: number,
  age?: string,
}

interface Column {
  Header: string,
  accessor: keyof AccountData
}

export const DEFAULT_COLUMN_ORDER: (keyof AccountData)[] = [
  'canister',
  'transactions',
  'age',
];

const columns: Column[] = [
  {
    Header: 'Canister',
    accessor: 'canister',
  },
  {
    Header: 'Transactions',
    accessor: 'transactions',
  },
  {
    Header: 'Age',
    accessor: 'age',
  },
];

const AccountsTable = ({
  data = [],
  id,
}: {
  // eslint-disable-next-line react/require-default-props
  data?: AccountData[],
  id: TableId,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(isTableDataReady(data));

  const formatters = useMemo(() => ({
    body: {
      canister: (cellValue: string) => <AccountLink account={cellValue} trim={false} />,
      transactions: (cellValue: string) => cellValue && formattedTransactionNumber(parseFloat(cellValue)) || 'n/a',
      age: (cellValue: string) => cellValue && dateRelative(cellValue) || 'n/a',
    },
  } as FormatterTypes), []);

  useEffect(() => {
    setIsLoading(isTableDataReady(data));
  }, [data]);

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
      />
    </Container>
  );
};

export default AccountsTable;
