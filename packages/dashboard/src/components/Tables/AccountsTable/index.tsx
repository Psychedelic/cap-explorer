import React, { useState, useMemo, useEffect } from 'react';
import { styled } from '@stitched';
import DataTable, { FormatterTypes, TableId } from '@components/Tables/DataTable';
import Title from '@components/Title';
import { dateRelative } from '@utils/date';
import { formattedNum } from '@utils/formatters';
import { isTableDataReady } from '@utils/tables';
import { AccountLink } from '@components/Link';
import ValueCell from '@components/Tables/ValueCell';

const Container = styled('div', {
  fontSize: '$s',
  fontFamily: 'Inter',
  lineHeight: '$normal',
  color: '$defaultTxtColour',

  '& [data-table] [data-scrollable] > div': {
    gridTemplateColumns: '20px 1fr 1fr 1fr 1fr',
    gridTemplateAreas: '"order account transactions age cycles"',
  },

  '& [data-cid="account"]': {
    justifySelf: 'left',
  },

  '& div': {
    lineHeight: 'inherit',
  },

  '& h1': {
    marginBottom: '20px',
  },
});

export interface Data {
  order: number,
  account: string,
  transactions: number,
  age: string,
  cycles: number,
}

interface Column {
  Header: string,
  accessor: keyof Data
}

export const DEFAULT_COLUMN_ORDER: (keyof Data)[] = [
  'order',
  'account',
  'transactions',
  'age',
  'cycles',
];

const columns: Column[] = [
  {
    Header: 'Order',
    accessor: 'order',
  },
  {
    Header: 'Account',
    accessor: 'account',
  },
  {
    Header: 'Transactions',
    accessor: 'transactions',
  },
  {
    Header: 'Age',
    accessor: 'age',
  },
  {
    Header: 'Cycles',
    accessor: 'cycles',
  },
];

const AccountsTable = ({
  data = [],
  id,
}: {
  // eslint-disable-next-line react/require-default-props
  data?: Data[],
  id: TableId,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(isTableDataReady(data));

  const formatters = useMemo(() => ({
    header: {
      order: () => '#',
    },
    body: {
      account: (cellValue: string) => <AccountLink account={cellValue} trim />,
      age: (cellValue: string) => dateRelative(cellValue),
      // MockData has the symbol $, we replace for now
      value: (cellValue: string) => formattedNum(parseFloat(cellValue.replace('$', ''))),
      cycles: (cellValue: string) => <ValueCell abbreviation="CYCLES" amount={Number(cellValue)} />,
    },
  } as FormatterTypes), []);

  useEffect(() => {
    setIsLoading(isTableDataReady(data));
  }, [data]);

  return (
    <Container
      data-id={id}
    >
      <Title size="ml">Accounts</Title>

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
