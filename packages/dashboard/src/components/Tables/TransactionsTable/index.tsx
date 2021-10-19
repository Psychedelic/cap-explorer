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
import { trimAccount } from '@utils/account';

const Container = styled('div', {
  fontSize: '$s',
  fontFamily: 'Inter',
  lineHeight: '$normal',
  color: '$defaultTxtColour',

  '& [data-table] [data-scrollable] > div': {
    gridTemplateColumns: '1fr 1fr 1fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr',
    gridTemplateAreas: '"operation caller from to time memo fee amount"',
    justifySelf: 'left',

    '& [data-cid]': {
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
  operation: string,
  caller: string,
  from: string,
  to: string,
  time: string,
  memo: number,
  fee: number,
  amount: number,
}

interface Column {
  Header: string,
  accessor: keyof Data,
  filters?: (keyof typeof TransactionTypes)[],
}

export type FetchPageDataHandler = ({
  pageIndex,
}: {
  pageIndex: number,
}) => void;

const DEFAULT_BASE_STATE = TransactionTypes.all;

export const DEFAULT_COLUMN_ORDER: (keyof Data)[] = [
  'operation',
  'caller',
  'from',
  'to',
  'time',
  'memo',
  'fee',
  'amount',
];

const columns: Column[] = [
  {
    Header: 'Operation',
    accessor: 'operation',
  },
  {
    Header: 'Caller',
    accessor: 'caller',
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
    Header: 'Time',
    accessor: 'time',
  },
  {
    Header: 'Memo',
    accessor: 'memo',
  },
  {
    Header: 'Fee',
    accessor: 'fee',
  },
  {
    Header: 'Amount',
    accessor: 'amount',
  },
];

const TransactionsTable = ({
  data = [],
  id,
  pageCount,
  fetchPageDataHandler,
}: {
  // eslint-disable-next-line react/require-default-props
  data?: Data[],
  id: TableId,
  pageCount: number,
  fetchPageDataHandler: FetchPageDataHandler,
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

    // TODO: set current, as disabled transaction type
    // setCurrentData(
    //   data.filter((v) => v.transactionType === selected),
    // );
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
      caller: (cellValue: string) => trimAccount(cellValue),
      from: (cellValue: string) => trimAccount(cellValue),
      to: (cellValue: string) => trimAccount(cellValue),
      fee: (cellValue: string) => <ValueCell abbreviation="CYCLES" amount={Number(cellValue)} />,
      amount: (cellValue: string) => formatPriceForChart({ value: cellValue, abbreviation: 'USD' }),
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
        pageCount={pageCount}
        fetchPageDataHandler={fetchPageDataHandler}
      />
    </Container>
  );
};

export default TransactionsTable;
