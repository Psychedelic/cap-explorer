import React, { useState, SetStateAction, Dispatch } from 'react';
import ContainerBox from '@components/ContainerBox';
import { styled, theme } from '@stitched';
import {
  formatPriceForChart,
  Currency,
} from '@utils/formatters';

const InnerBoxContainer = styled('div', {
  fontFamily: 'Inter',
  color: '#FFFFFF',
  display: 'flex',
  flexFlow: 'column',
  fontSize: '$l',
  fontWeight: '600',
  padding: '10px 0 0',
  position: 'relative',
  height: '68px',

  '& span:first-child': {
    paddingBottom: '12px',
    fontSize: '$m',
    fontWeight: 'normal',
  },
});

const ValueConversionToggle = styled('div', {
  width: '80px',
  height: '28px',
  position: 'absolute',
  top: 20,
  right: 16,
  background: theme.colors.darkGrey.value,
  borderRadius: 5,

  '& button': {
    width: 'calc(50% - 4px)',
    height: 'calc(100% - 4px)',
    borderRadius: 'inherit',
    margin: '2px',
    fontSize: '$s',
    fontFamily: 'Inter',

    '&:nth-child(1)': {
      marginRight: '0px',
    },

    '&:nth-child(2)': {
      marginLeft: '0px',
    },

    '&[data-active="true"]': {
      background: '#232323',
    },
  },
});

const activeCurrencyFormatter = ({
  value,
  activeCurrency,
}: {
  value: number,
  activeCurrency: Currency,
}) => formatPriceForChart({
  value,
  abbreviation: activeCurrency,
});

export const InnerBox = ({
  label,
  value,
  activeCurrency,
}: {
  label: string,
  value: number,
  activeCurrency: Currency,
}) => (
  <InnerBoxContainer>
    <span>{label}</span>
    <span>
      {
        activeCurrencyFormatter({
          value,
          activeCurrency,
        })
      }
    </span>
  </InnerBoxContainer>
);

interface InfoBoxProps {
  id: string,
  label: string,
  value: number,
  currency: Currency,
  showValueConversion: boolean,
}

const isActiveCurrency = ({
  current,
  base,
}: {
  current: Currency,
  base: Currency,
}) => current === base;

const activeCurrencyHandler = ({
  currency,
  value,
  setActiveCurrency,
  setConvertedValue,
}: {
  currency: Currency,
  value: number,
  setActiveCurrency: Dispatch<SetStateAction<Currency>>,
  setConvertedValue: Dispatch<SetStateAction<typeof value>>,
}) => {
  setActiveCurrency(currency);

  // TODO: conversion handler
  // This is a mock conversion placeholder
  const convertedValue = currency === 'USD' ? (value / 16) : value;

  setConvertedValue(convertedValue);
};

const DEFAULT_BASE_CURRENCY: Currency = 'USD';

export const InfoBoxSimple = ({
  id,
  label,
  value,
}: {
  id: string,
  label: string,
  value: string,
}) => (
  <ContainerBox
    id={id}
  >
    <InnerBoxContainer>
      <span>{label}</span>
      <span>
        { value }
      </span>
    </InnerBoxContainer>
  </ContainerBox>
);

const InfoBox = ({
  id,
  label,
  value,
  currency,
  showValueConversion,
}: InfoBoxProps) => {
  const [activeCurrency, setActiveCurrency] = useState<Currency>(currency);
  const [convertedValue, setConvertedValue] = useState<number>(value);

  return (
    <ContainerBox
      id={id}
    >
      {
        showValueConversion
        && (
          <ValueConversionToggle
            data-value-conversion-toggle
          >
            <button
              type="button"
              data-convert-to={currency}
              data-active={
                isActiveCurrency({
                  current: activeCurrency,
                  base: currency,
                })
              }
              onClick={
                () => activeCurrencyHandler({
                  currency,
                  value,
                  setActiveCurrency,
                  setConvertedValue,
                })
              }
            >
              #
            </button>
            <button
              type="button"
              data-convert-to="usd"
              data-active={
                isActiveCurrency({
                  current: activeCurrency,
                  base: DEFAULT_BASE_CURRENCY,
                })
              }
              onClick={() => activeCurrencyHandler({
                currency: DEFAULT_BASE_CURRENCY,
                value,
                setActiveCurrency,
                setConvertedValue,
              })}
            >
              $
            </button>
          </ValueConversionToggle>
        )
      }

      <InnerBox
        label={label}
        value={convertedValue}
        activeCurrency={activeCurrency}
      />
    </ContainerBox>
  );
};

export default InfoBox;
