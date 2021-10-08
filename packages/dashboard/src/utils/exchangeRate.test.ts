import { getExchangeRateByName } from './exchangeRate';

describe('getExchangeRateByName', () => {
  it('should calculate the USD equivalent from TC (hundred TCs)', () => {
    const result = getExchangeRateByName({
      exchangePair: 'TC/USD',
      value: 321,
    });

    expect(result).toBe(462.24);
  });

  it('should calculate the USD equivalent for TC (thousand TCs)', () => {
    const result = getExchangeRateByName({
      exchangePair: 'TC/USD',
      value: 5000,
    });

    expect(result).toBe(7200);
  });

  it('should calculate the USD equivalent for TC (million TCs)', () => {
    const result = getExchangeRateByName({
      exchangePair: 'TC/USD',
      value: 3000000,
    });

    expect(result).toBe(4320000);
  });

  it('should calculate the USD equivalent for TC (billion TCs)', () => {
    const result = getExchangeRateByName({
      exchangePair: 'TC/USD',
      value: 5678000000,
    });

    expect(result).toBe(8176320000);
  });

  it('should calculate the USD equivalent for TC (trillion TCs)', () => {
    const result = getExchangeRateByName({
      exchangePair: 'TC/USD',
      value: 1888900000100,
    });

    expect(result).toBe(2720016000144);
  });

  it('should calculate the USD equivalent for TC (small number, decimal, TCs)', () => {
    const result = getExchangeRateByName({
      exchangePair: 'TC/USD',
      value: 0.001,
    });

    expect(result).toBe(0.0014399999999999999);
  });
});
