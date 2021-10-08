import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { styled } from '@stitched';
import DataTable, { HeaderTabs, TableId } from '@components/Tables/DataTable';
import Title from '@components/Title';
import { AccountLink } from '@components/Link';
import { isTableDataReady } from '@utils/tables';
import ValueCell from '@components/Tables/ValueCell';
import { dateRelative } from '@utils/date';
import { formatPriceForChart } from '@utils/formatters';

const Container = styled('div', {
  fontSize: '$s',
  fontFamily: 'Inter',
  lineHeight: '$normal',
  color: '$defaultTxtColour',

  '& [data-table] [data-scrollable] > div': {
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    gridTemplateAreas: '"transactionType from to time cycles totalValue"',

    '& [data-cid="transactionType"]': {
      display: 'block',
    },

    '& [data-cid="from"], & [data-cid="to"]': {
      justifySelf: 'left',
    },
  },

  '& div': {
    lineHeight: 'inherit',
  },

  '& h1': {
    marginBottom: '20px',
  },
});

export enum TransactionTypes {
  all = 'all',
  deposit = 'deposit',
  withdraw = 'withdraw',
}

enum TransactionTypeAlias {
  all = 'All',
  deposit = 'Deposit Cycles',
  withdraw = 'Withdraw Cycles'
}

export interface Data {
  transactionType: TransactionTypes,
  from: string,
  to: string,
  totalValue: number,
  cycles: number,
  time: string,
}

interface Column {
  Header: string,
  accessor: keyof Data,
  filters?: (keyof typeof TransactionTypes)[],
}

const DEFAULT_BASE_STATE = TransactionTypes.all;

export const DEFAULT_COLUMN_ORDER: (keyof Data)[] = [
  'transactionType',
  'from',
  'to',
  'time',
  'cycles',
  'totalValue',
];

const columns: Column[] = [
  {
    Header: 'All',
    accessor: 'transactionType',
    filters: ['all', 'deposit', 'withdraw'],
  },
  {
    Header: 'From',
    accessor: 'from',
  },
  {
    Header: 'To',
    accessor: 'to',
  },
  {
    Header: 'Total Value',
    accessor: 'totalValue',
  },
  {
    Header: 'Cycles Amount',
    accessor: 'cycles',
  },
  {
    Header: 'Time',
    accessor: 'time',
  },
];

const TransactionsTable = ({
  data = [],
  id,
}: {
  // eslint-disable-next-line react/require-default-props
  data?: Data[],
  id: TableId,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(isTableDataReady(data));
  const [currentData, setCurrentData] = useState<Data[]>(data);

  const onSelectionHandler = useCallback((selected: TransactionTypes) => {
    // TODO: this will be connected to the IC
    if (selected === DEFAULT_BASE_STATE) {
      setCurrentData(
        data,
      );
      return;
    }

    setCurrentData(
      data.filter((v) => v.transactionType === selected),
    );
  }, [data]);

  const headerGroupHandler = useCallback((filters: TransactionTypes[]) => (
    <HeaderTabs
      filters={filters}
      onSelectionHandler={onSelectionHandler}
      id={id}
    />
  ), [onSelectionHandler]);

  const formatters = useMemo(() => ({
    body: {
      transactionType: (value: TransactionTypes) => TransactionTypeAlias[value],
      from: (cellValue: string) => (
        <AccountLink
          account={cellValue}
          trim
        />
      ),
      to: (cellValue: string) => (
        <AccountLink
          account={cellValue}
          trim
        />
      ),
      cycles: (cellValue: string) => <ValueCell abbreviation="CYCLES" amount={Number(cellValue)} />,
      totalValue: (cellValue: string) => formatPriceForChart({ value: cellValue, abbreviation: 'USD' }),
      time: (cellValue: string) => dateRelative(cellValue),
    },
  }), [headerGroupHandler]);

  useEffect(() => {
    setCurrentData(data);
    setIsLoading(isTableDataReady(data));
  }, [data]);

  return (
    <Container
      data-id={id}
    >
      <Title size="ml">Transactions</Title>

      <DataTable
        columns={columns}
        data={currentData}
        formatters={formatters}
        columnOrder={DEFAULT_COLUMN_ORDER}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default TransactionsTable;
