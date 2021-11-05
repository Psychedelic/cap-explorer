import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { styled } from '@stitched';
import DataTable, { HeaderTabs, TableId } from '@components/Tables/DataTable';
import Title from '@components/Title';
import ValueCell from '@components/Tables/ValueCell';
import { dateRelative } from '@utils/date';
import { formatPriceForChart } from '@utils/formatters';
import { trimAccount } from '@utils/account';
import Fleekon, { IconNames } from '@components/Fleekon';
import { IconNames } from '@components/Icon';

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

    '& [data-cid="fee"], & [data-cid="amount"]': {
      justifySelf: 'right',
    },
  },

  '& div': {
    lineHeight: 'inherit',
  },

  '& h1': {
    marginBottom: '20px',
  },
});

type OperationType = 'burn' | 'mint' | 'transfer' & Partial<IconNames>;

const OperationCell = styled('span', {
  textTransform: 'capitalize',
  display: 'flex',
  alignItems: 'center',

  '& > span:first-child': {
    marginRight: '10px',
  },
});

const Operation = ({
  type
}: {
  type: OperationType,
}) => {
  const availableOperations = ['burn', 'mint', 'transfer'];

  // On unknown operation types, shows text only
  if (!availableOperations.includes(type)) return <span>{type}</span>;

  return (
    <OperationCell>
      <Fleekon
        icon={type}
        className="icon-operation-type"
      />
      <span>{type}</span>
    </OperationCell>
  )
};

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
    Header: 'Type',
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
  isLoading = false,
}: {
  // eslint-disable-next-line react/require-default-props
  data?: Data[],
  id: TableId,
  pageCount: number,
  fetchPageDataHandler: FetchPageDataHandler,
  isLoading: boolean,
}) => {
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
      operation: (cellValue: OperationType) => {
        if (typeof cellValue !== 'string') return;
        return <Operation type={cellValue} />
      },
      caller: (cellValue: string) => trimAccount(cellValue),
      from: (cellValue: string) => {
        if (!cellValue) return 'n/a';
        return trimAccount(cellValue);
      },
      to: (cellValue: string) => {
        if (!cellValue) return 'n/a';
        return trimAccount(cellValue);
      },
      fee: (cellValue: string) => <ValueCell abbreviation="CYCLES" amount={Number(cellValue)} />,
      amount: (cellValue: string) => formatPriceForChart({ value: cellValue, abbreviation: 'USD' }),
      time: (cellValue: string) => dateRelative(cellValue),
      memo: (cellValue: string) => {
        if (!cellValue) return 'n/a';
        return Number(cellValue)
      },
    },
  }), [headerGroupHandler]);

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  return (
    <Container
      data-id={id}
    >
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
