import React from 'react';
import { styled } from '@stitched';
import { formatPriceForChart, Currency } from '@utils/formatters';
import { getExchangeRateByName } from '@utils/exchangeRate';

export const ValueCellContainer = styled('div', {
  display: 'flex',
  flexFlow: 'column',
  padding: '10px 0',

  '& span': {
    textAlign: 'right',

    '&:nth-child(2)': {
      color: '$midGrey',
      paddingTop: '6px',
    },
  },
});

export default ({
  amount,
  abbreviation,
}: {
  amount: number,
  abbreviation: Currency,
}) => {
  const usdAmount = getExchangeRateByName({
    exchangePair: 'TC/USD',
    value: amount,
  });

  return (
    <ValueCellContainer>
      <span>{formatPriceForChart({ value: usdAmount, abbreviation: 'USD' })}</span>
      <span>{formatPriceForChart({ value: amount, abbreviation })}</span>
    </ValueCellContainer>
  );
};
