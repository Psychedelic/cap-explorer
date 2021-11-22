import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { styled } from '@stitched';
import DataTable, { HeaderTabs, TableId } from '@components/Tables/DataTable';
import { dateRelative } from '@utils/date';
import { formatPriceForChart } from '@utils/formatters';
import { trimAccount } from '@utils/account';
import Fleekon, { IconNames } from '@components/Fleekon';
import { getXTCMarketValue } from '@utils/xtc';

const Container = styled('div', {
  fontSize: '$s',
  fontFamily: 'Inter',
  lineHeight: '$normal',
  color: '$defaultTxtColour',

  '& [data-table] [data-scrollable] > div': {
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    gridTemplateAreas: '"operation price caller from to time"',
    justifySelf: 'left',

    '& [data-cid="type"], & [data-cid="amount"]': {
      justifySelf: 'left',
    },

    ' & [data-cid="time"]': {
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

const PriceCell = styled('div', {
  '& div': {
    lineHeight: 1.6,
  },

  '& div:nth-child(2)': {
    fontSize: '12px',
    color: '$midGrey'
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
  amount: string,
  caller: string,
  from: string,
  to: string,
  time: string,
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
  'amount',
  'caller',
  'from',
  'to',
  'time'
];

const NOT_AVAILABLE_PLACEHOLDER = '---';

const columns: Column[] = [
  {
    Header: 'Type',
    accessor: 'operation',
  },
  {
    Header: 'Price',
    accessor: 'amount',
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
      amount: (cellValue: number) => {
        if (!cellValue || typeof cellValue !== 'bigint') return NOT_AVAILABLE_PLACEHOLDER;

        const usdValue = getXTCMarketValue(cellValue);

        return (
          <PriceCell>
            <div>{formatPriceForChart({ value: usdValue, abbreviation: 'USD' })}</div>
            <div>{formatPriceForChart({ value: cellValue, abbreviation: 'CYCLES' })}</div>
          </PriceCell>
        );
      },
      caller: (cellValue: string) => trimAccount(cellValue),
      from: (cellValue: string) => {
        if (!cellValue) return NOT_AVAILABLE_PLACEHOLDER;
        return trimAccount(cellValue);
      },
      to: (cellValue: string) => {
        if (!cellValue) return NOT_AVAILABLE_PLACEHOLDER;
        return trimAccount(cellValue);
      },
      time: (cellValue: string) => dateRelative(cellValue),
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
