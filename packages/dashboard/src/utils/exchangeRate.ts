/* eslint-disable import/prefer-default-export */

type ExchangePair = 'TC/USD';

// TODO: WARNING: initial version uses hard-typed value
const SDR_IMF_RATE = 1.44;

// TODO: should compute https://www.imf.org/external/np/fin/data/rms_sdrv.aspx
// from an API (e.g. https://fixer.io/)
export const getExchangeRateForCycles = (value: number) => value * SDR_IMF_RATE;

export const getExchangeRateByName = ({
  exchangePair,
  value,
}: {
  exchangePair: ExchangePair,
  value: number,
}) => {
  if (exchangePair === 'TC/USD') return getExchangeRateForCycles(value);

  return 'n/a';
};
