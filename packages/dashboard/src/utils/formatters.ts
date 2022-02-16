/* eslint-disable import/prefer-default-export */
import numeral from 'numeral';

// defaults
numeral.zeroFormat('n/a');
numeral.nullFormat('n/a');

export const formattedTransactionNumber = (num: number) => numeral(num).format('0.0a') 

export const toK = (num: number) => numeral(num).format('0.[00]a');

export const CurrencyOptions = {
  USD: '$',
  ICP: 'ICP',
  // By convention Cycles values
  // are passed in Trillions of Cycles
  CYCLES: 'XTC',
};

export type Currency = keyof typeof CurrencyOptions;

export const formatDollarAmount = (
  num: number,
  digits: number,
  currency: Currency,
) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return formatter.format(num);
};

export const formattedNum = (
  num: number,
  currencyOption: Currency = 'USD',
) => {
  const currency = CurrencyOptions[currencyOption];

  if (Number.isNaN(num) || num === undefined) return `${currency}${0}`;

  if (num > 500000000) return `${currency}${toK(num)}`;

  if (num === 0) {
    return `${currency}0`;
  }

  if (num < 0.0001 && num > 0) return `< ${currency}0.0001`;

  if (num > 1000) return formatDollarAmount(num, 0, currencyOption);

  if (num < 0.1) {
    return formatDollarAmount(num, 4, currencyOption);
  }

  return formatDollarAmount(num, 2, currencyOption);
};

export enum FormatterLocales {
  US = 'en-US',
}

export const computeValueToLocale = ({
  value,
}: {
  value: string | number,
}) => numeral(Number((typeof value === 'string' ? parseFloat(value) : value))).format('0.00a');

const formatDollarValue = (value: string) => `$${value.replace(' $', '')}`;

export const priceFormatByAbbreviation = ({
  value,
  abbreviation,
} : {
  value: string,
  abbreviation: Currency,
}): string => {
  let computedValue: string = '';

  if (value.includes('t')) {
    computedValue = value.replace('t', `T ${CurrencyOptions[abbreviation]}`);
  } else if (value.includes('m')) {
    computedValue = value.replace('m', `M ${CurrencyOptions[abbreviation]}`);
  } else if (value.includes('k')) {
    computedValue = value.replace('k', `K ${CurrencyOptions[abbreviation]}`);
  } else {
    computedValue = `${value} ${CurrencyOptions[abbreviation]}`;
  }

  if (abbreviation === 'USD') {
    computedValue = formatDollarValue(computedValue);
  }

  return computedValue.replace('.00', '').toUpperCase();
};

// Numbers in scientific notation handler
export const scientificNotationSmallNumHandler = ({
  value,
} : {
  value: number,
}) => (
  typeof value === 'string'
    ? parseFloat(value)
    : value
).toFixed(12).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1'); // removes trailing zeros 0.000000001200 -> 0.0000000012

export const formatPriceForChart = ({
  value,
  abbreviation,
}: {
  value: string | number,
  abbreviation: Currency,
}) => {
  if (abbreviation === 'CYCLES') {
    if (value <= 0.000001) {
      return `${
        scientificNotationSmallNumHandler({
          value: Number(value),
        })
      } ${CurrencyOptions[abbreviation]}`;
    }

    return `${numeral(value).format('0,0')} ${CurrencyOptions[abbreviation]}`;
  }

  // Exception handler for small USD
  if (value <= 0.000001 && abbreviation === 'USD') {
    const computedValue = scientificNotationSmallNumHandler({
      value: Number(value),
    });
    return `${CurrencyOptions[abbreviation]}${computedValue}`;
  }

  let computedValue = computeValueToLocale({ value });
  computedValue = priceFormatByAbbreviation({ value: computedValue, abbreviation });
  return computedValue;
};

export const formatPriceDetailToString = (price: { value?: bigint, decimals?: bigint, currency?: string }) => {
  if (!price.value) return '-';
  const divisor = price.decimals ? 10 ** Number(price.decimals) : 1;
  const currency = price.currency || '';
  return `${(Number(price.value) / divisor).toFixed(2)} ${currency}`;
};