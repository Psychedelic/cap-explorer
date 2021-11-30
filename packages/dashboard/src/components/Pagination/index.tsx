import React from 'react';
import Fleekon from '@components/Fleekon';
import { styled } from '@stitched';

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

export default ({
  previousPage,
  canPreviousPage,
  pageOptions,
  currentPageIndex,
  nextPage,
  canNextPage,
}: {
  previousPage: () => void,
  canPreviousPage: boolean,
  pageOptions: any[],
  currentPageIndex: number,
  nextPage: () => void,
  canNextPage: boolean,
}) => {
  const showPaginationArrows = pageOptions.length === 1;
  const displayStyle = showPaginationArrows  ? 'none' : '';

  return (
    <Pagination data-pagination>
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
        style={{
          display: displayStyle,
        }}
      >
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
        style={{
          display: displayStyle,
        }}
      >
        <Fleekon
          icon="arrowRight"
          className="arrow arrow-right"
          size="13px"
        />
      </button>
    </Pagination>
  );
}