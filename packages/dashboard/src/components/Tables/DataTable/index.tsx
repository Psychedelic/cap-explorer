/* eslint-disable react/require-default-props */
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import {
  useTable,
  Column,
  usePagination,
  useColumnOrder,
  HeaderGroup,
  ColumnInstance,
} from 'react-table';
import ContainerBox from '@components/ContainerBox';
import { styled, BREAKPOINT_DATA_TABLE_L } from '@stitched';
import { TransactionTypes, FetchPageDataHandler } from '@components/Tables/TransactionsTable';
import TableDropDownSelect from '@components/TableDropdownSelect';
import { useWindowResize } from '@hooks/windowResize';
import { PAGE_SIZE } from '@hooks/store';
import Loading from '@components/Loading';
import Fleekon from '@components/Fleekon';

const RowWrapper = styled('div', {
  display: 'grid',
  gap: '1em',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
  columnGap: '$tableColumnSpacing',
  alignItems: 'flex-start',
  width: '100%',
  borderBottom: '1px solid $borderGrey',
  padding: '20px 0',
  color: '$defaultTxtColour',
  fontFamily: 'Inter',
  position: 'relative',
  transition: 'background-color 0.3s',

  '&:last-child': {
    borderBottom: 'none',
  },

  '& > div': {
    fontSize: '$s',
    justifySelf: 'flex-end',
    zIndex: 2,

    '&:first-child': {
      justifySelf: 'flex-start',
      marginLeft: '10px',
    },
  },


  '&[data-row]': {

    '&:hover': {  
      backgroundColor: '#333',
    },
  },
});

const ColWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  overflow: 'visible',
  width: 'calc(100vw - 80px)',
  margin: 0,
  padding: 0,

  '& a': {
    transition: 'color 0.3s',

    '&:hover': {
      color: '$purple',
    },
  },

  '@lg': {
    width: 'calc(100vw - 320px)',
    padding: '0 10px',
    overflowX: 'scroll',
  },

  '@dataTableBreakPointL': {
    width: '100%',
    overflow: 'visible',
  },
});

const Pagination = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  marginTop: '2em',
  marginBottom: '2em',
  fontFamily: 'Inter',
  fontSize: '$s',
  color: '$defaultTxtColour',

  '& > span': {
    padding: '0 20px',
  },

  '& svg': {
    fontSize: '$s',
    color: '$defaultTxtColour',
    transition: 'fill 0.3s',

    '&:hover': {
      fill: '$purple !important',
    }
  },

  '& button': {
    transform: 'translateX(0)',
    transition: 'transform 0.2s ease-in',
    background: 'none',
    border: 'none',
    cursor: 'pointer',

    '&:hover': {
      transform: 'translateX(2px)',
    },

    '&:first-child': {
      '&:hover': {
        transform: 'translateX(-2px)',
      },
    },
  },

  '& .arrow': {
    position: 'relative',
    top: '1px',
  },

  '& .arrow-left': {
    transform: 'rotate(180deg)',
  },
});

const Tabs = styled('div', {
  display: 'flex',

  '& > button': {
    marginRight: '20px',
    textTransform: 'capitalize',

    '&:last-child': {
      marginRight: 0,
    },
  },
});

const TabButton = styled('button', {
  color: '$midGrey',

  variants: {
    selected: {
      true: {
        color: '$defaultTxtColour',
      },
    },
  },
});

const ScrollXContainer = styled('div', {
  overflowX: 'scroll',
  width: 'calc(100vw - 80px)',

  '& > div': {
    display: 'table',
    minWidth: '968px',
  },

  '@lg': {
    width: 'calc(100vw - 80px)',
    overflowX: 'visible',

    '& > div': {
      display: 'block',
      minWidth: 'auto',
    },
  },

  '@dataTableBreakPointL': {
    width: '100%',
    overflow: 'visible',
  },
});

const DropdownContainer = styled('div', {
  position: 'relative',
  transform: 'translateX(-8px)',

  '& [data-dd-ctrlr]': {
    background: 'transparent',
  },
});

const LoadingContainer = styled('div', {
  width: '100%',
  padding: '80px 0',
});

const Cell = styled('div', {
  overflow: 'hidden',
  wordBreak: 'break-word',
});

const IconHintScrollXContainer = styled('span', {
  position: 'absolute',
  top: '34px',
  right: '24px',
  opacity: 1,
  transition: 'opacity 0.3s ease-out',

  variants: {
    show: {
      false: {
        opacity: 0,
      },
    },
  },

  '@dataTableBreakPointS': {
    display: 'none',
  },
});

const EmptyTable = styled('span', {
  padding: '30px 0px 0px',
  display: 'inline-block',
  color: '$midGrey',
});

// TODO: check if the arrow hint is in use?
const IconHintScrollX = ({
  show,
}: {
  show: boolean,
}) => (
  <IconHintScrollXContainer
    show={show}
  >
    <Fleekon
      icon="arrowRight"
      className="arrow arrow-top"
      size="18px"
    />
  </IconHintScrollXContainer>
);

const RowCell = ({
  cid,
  value,
}: {
  cid: string,
  value: React.ReactNode,
}) => (
  <Cell data-cid={cid}>
    {value}
  </Cell>
);

export type TableTitle = 'Accounts' | 'Transactions';

export type TableId = 'overview-page-transactions' | 'app-transactions-page';

export const HeaderTabs = <T extends string>({
  filters,
  onSelectionHandler,
  id,
}: {
  filters: T[],
  onSelectionHandler: (filter: T) => void,
  id: TableId
}) => {
  const isSmallerThanBreakpointL = useWindowResize({
    breakpoint: BREAKPOINT_DATA_TABLE_L,
  });
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const selectHandler = (index: number, selection: T) => {
    setSelectedTab(index);
    onSelectionHandler(selection);
  };

  return (
    (
      isSmallerThanBreakpointL
      && (
      <DropdownContainer
        data-filters
      >
        <TableDropDownSelect
          show
          title="Drop down options"
          options={filters}
          onSelectHandler={onSelectionHandler}
          id={id}
        />
      </DropdownContainer>
      )
    )
    || (
      <Tabs
        data-filters
      >
        {
          filters.map((v, key) => (
            <TabButton
              // eslint-disable-next-line react/no-array-index-key
              key={key}
              type="button"
              onClick={() => selectHandler(key, v)}
              selected={key === selectedTab}
              data-option={v}
            >
              {v}
            </TabButton>
          ))
        }
      </Tabs>
    )
  );
};

export interface HeaderItem extends Record<string, string> {
  Header: string,
  accessor: string,
}

export type DataItem<T> = {
  [P in keyof T]?: T[P]
}

interface FormatterTypesHeader extends Record<string, string | React.ReactNode> {
  transactionType?: (value: TransactionTypes[]) => React.ReactNode,
  order?: () => string,
}

type FormatterTypesBody = {
  account?: (value: string) => React.ReactNode,
  transactionType?: (value: TransactionTypes) => string,
  from?: (value: string) => React.ReactNode,
  to?: (value: string) => React.ReactNode,
  totalValue?: (value: string) => string,
  time?: (value: string) => string,
}

export interface FormatterTypes {
  header?: FormatterTypesHeader,
  body?: FormatterTypesBody,
}

interface DataTableProps<T extends object> {
  columns: Column<T>[],
  data: T[],
  formatters?: FormatterTypes,
  columnOrder: string[],
  isLoading: boolean,
  pageCount: number,
  fetchPageDataHandler: FetchPageDataHandler,
}

interface HeaderGroupExtented {
  filters?: TransactionTypes[],
}

const formatterCallbackHandler = <T extends {}>(
  formatters: FormatterTypes,
  formatterType: keyof FormatterTypes,
  column: (HeaderGroup<T> | ColumnInstance<T>) & HeaderGroupExtented,
  baseValue: React.ReactNode,
): React.ReactNode => {
  let callback;

  if (formatters[formatterType]
      && column.id in formatters[formatterType]!) {
    const ft = formatters[formatterType]!;
    const { id } = column;
    callback = ft[(id as keyof (FormatterTypesBody | FormatterTypesHeader))];
  }

  if (typeof callback !== 'function') return baseValue;

  if (formatterType === 'header'
      && column?.filters) {
    return callback(column.filters);
  }

  return callback(baseValue);
};

const DataTable = <T extends {}>({
  columns,
  data,
  formatters = {},
  columnOrder,
  isLoading,
  pageCount,
  fetchPageDataHandler,
}: DataTableProps<T>) => {
  const [showIconHintScrollX, setShowIconHintScrollX] = useState(true);
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);
  const refDOMScrollXContainer = useRef<HTMLDivElement | undefined>();

  const tableInstance = useTable<T>({
    columns: memoizedColumns,
    data: memoizedData,
    initialState: {
      pageIndex: 0,
      // TODO: When required, control page size dynamically
      pageSize: PAGE_SIZE,
    },
    // TODO: handle fetch, provide own pageCount
    manualPagination: true,
    pageCount,
  },
  usePagination,
  useColumnOrder);

  const {
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setColumnOrder,
    state: {
      pageIndex,
    },
  } = tableInstance;

  useEffect(() => {
    setColumnOrder(columnOrder);
  }, [columnOrder]);

  useEffect(() => {
    if (!refDOMScrollXContainer?.current) return;

    const handler = () => {
      if (
        showIconHintScrollX
        && refDOMScrollXContainer?.current
        && refDOMScrollXContainer?.current?.scrollLeft <= 40
      ) return;
      setShowIconHintScrollX(false);
    };
    const destroyListener = () => refDOMScrollXContainer?.current?.removeEventListener('scroll', handler);

    refDOMScrollXContainer?.current?.addEventListener('scroll', handler);
    // eslint-disable-next-line consistent-return
    return destroyListener;
  }, [refDOMScrollXContainer?.current]);

  const currentPageIndex = pageIndex + 1;

  // TODO: on control page size, compute request
  useEffect(() => {
    if (typeof fetchPageDataHandler !== 'function') return;

    try {
      fetchPageDataHandler({
        pageIndex,
      });
    } catch (err) {
      // TODO: What to do on failure? Handle gracefully
      console.warn(`Oops! Failed to fetch the page ${pageIndex} data`);
    };
  }, [pageIndex]);

  return (
    <>
      <ContainerBox>
        {
          (
            isLoading
            && (
              <LoadingContainer>
                <Loading alt="Loading the data table" size="m" />
              </LoadingContainer>
            )
          )
          || (
            <ColWrapper data-table>
              <ScrollXContainer
                ref={refDOMScrollXContainer as React.RefObject<HTMLDivElement>}
                data-scroll-controller
              >
                <div data-scrollable>
                  <RowWrapper data-header>
                    {
                      headerGroups.map(
                        (headerGroup) => headerGroup.headers.map((
                          column,
                        ) => {
                          const { key: colHeaderKey } = column.getHeaderProps();

                          return (
                            <div
                              key={colHeaderKey}
                              data-cid={column?.id}
                            >
                              {
                                formatterCallbackHandler(
                                  formatters,
                                  'header',
                                  column,
                                  column.render('Header'),
                                )
                              }
                            </div>
                          );
                        }),
                      )
                    }
                  </RowWrapper>
                  {
                    page.length > 0
                    ? page.map((row) => {
                      prepareRow(row);

                      return (
                        <RowWrapper key={row.index} data-row>
                          {
                            row.cells.map((cell) => {
                              const { key: colHeaderKey } = cell.column.getHeaderProps();

                              return (
                                <RowCell
                                  key={colHeaderKey}
                                  cid={cell?.column?.id}
                                  value={
                                    formatterCallbackHandler(
                                      formatters,
                                      'body',
                                      cell?.column,
                                      cell.value,
                                    )
                                  }
                                />
                              );
                            })
                          }
                        </RowWrapper>
                      );
                    })
                    : <EmptyTable>No results found!</EmptyTable>
                  }
                </div>
                <IconHintScrollX show={showIconHintScrollX} />
              </ScrollXContainer>
              {/*
                TODO: hide arrows on total page 1
              */}
              <Pagination data-pagination>
                <button
                  type="button"
                  aria-label="Previous page"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  {/* <Icon
                    icon="ArrowLeft"
                    size="lg"
                    title="Previous page"
                  /> */}
                  <Fleekon
                    icon="arrowRight"
                    className="arrow arrow-left"
                    size="13px"
                  />
                </button>
                <span data-page-index={currentPageIndex}>
                  {`${currentPageIndex} of ${pageOptions.length}`}
                </span>
                <button
                  type="button"
                  aria-label="Next page"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  {/* <Icon
                    icon="ArrowRight"
                    size="lg"
                    title="Next page"
                  /> */}
                  <Fleekon
                    icon="arrowRight"
                    className="arrow arrow-right"
                    size="13px"
                  />
                </button>
              </Pagination>
            </ColWrapper>
          )
        }
      </ContainerBox>
    </>
  );
};

export default DataTable;
