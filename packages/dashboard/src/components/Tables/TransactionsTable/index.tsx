import React, {
  useEffect,
  useState,
  useMemo,
} from 'react';
import { styled } from '@stitched';
import DataTable, { TableId } from '@components/Tables/DataTable';
import { dateRelative } from '@utils/date';
import { formatPriceForChart } from '@utils/formatters';
import Fleekon, { IconNames } from '@components/Fleekon';
import { getXTCMarketValue } from '@utils/xtc';
import {
  CanisterMetadata,
  getNFTDetails,
} from '@utils/dab';
import { toICRocksPrincipal } from '@utils/link';
import { trimAccount } from '@utils/account';
import ItemCell from '@components/ItemCell';

const Container = styled('div', {
  fontSize: '$s',
  fontFamily: 'Inter',
  lineHeight: '$normal',
  color: '$defaultTxtColour',

  '& [data-table] [data-scrollable] > div': {
    gridTemplateColumns: '1fr 0.6fr 0.6fr 0.4fr 0.4fr 0.6fr',
    gridTemplateAreas: '"operation item amount from to time"',
    alignItems: 'center',

    '& [data-cid]': {
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
  item: number,
  amount: string,
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

export const DEFAULT_COLUMN_ORDER: (keyof Data)[] = [
  'item',
  'operation',
  'amount',
  'from',
  'to',
  'time'
];

const NOT_AVAILABLE_PLACEHOLDER = '-';

const columns: Column[] = [
  {
    Header: 'Type',
    accessor: 'operation',
  },
  {
    Header: 'Item',
    accessor: 'item',
  },
  {
    Header: 'Price',
    accessor: 'amount',
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
  identityInDab,
  tokenId,
}: {
  // eslint-disable-next-line react/require-default-props
  data?: Data[],
  id: TableId,
  pageCount: number,
  fetchPageDataHandler: FetchPageDataHandler,
  isLoading: boolean,
  identityInDab?: CanisterMetadata,
  tokenId: string,
}) => {
  const [currentData, setCurrentData] = useState<Data[]>(data);

  const formatters = useMemo(() => ({
    body: {
      operation: (cellValue: OperationType) => {
        if (typeof cellValue !== 'string') return;
        return <Operation type={cellValue} />
      },
      item: (cellValue: number) => (
        <ItemCell
          identityInDab={identityInDab}
          cellValue={cellValue}
          derivedId={true}
        />
      ),
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
      from: (cellValue: string) => {
        if (!cellValue) return NOT_AVAILABLE_PLACEHOLDER;
        return (
          <a href={toICRocksPrincipal(cellValue)} target="_blank">
            { trimAccount(cellValue) }
          </a>
        );
      },
      to: (cellValue: string) => {
        if (!cellValue) return NOT_AVAILABLE_PLACEHOLDER;
        return (
          <a href={toICRocksPrincipal(cellValue)} target="_blank">
            { trimAccount(cellValue) }
          </a>
        );
      },
      time: (cellValue: string) => dateRelative(cellValue),
    },
  }), [identityInDab]);

  useEffect(() => {
    setCurrentData(data);

    // Get all the Dab NFT item details
    // export interface Data {
    //   operation: string,
    //   item: number,
    //   amount: string,
    //   from: string,
    //   to: string,
    //   time: string,
    // }
    (async () => {
      console.log('[debug] transactions table: data: ', data);
      const standard = identityInDab?.name;
  
      if (!standard) return;
  
      const dabNFTMetadataPromises = data.map(
        (item) => getNFTDetails({
            tokenId,
            tokenIndex: item.item,
            standard,
          })
      );
  
      const dabNFTMetadataRes = await Promise.all(dabNFTMetadataPromises);

      console.log('[debug] transactions table: dabNFTMetadataRes: ', dabNFTMetadataRes);
    })();    
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
