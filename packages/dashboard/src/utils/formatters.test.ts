import {
  formattedNum,
  formatPriceForChart,
  computeValueToLocale,
  scientificNotationSmallNumHandler,
} from './formatters';

describe('Formatters', () => {
  describe('formattedNum', () => {
    describe('when a valid number is passed to', () => {
      test('computes a valid formatted string (ridiculous)', () => {
        const val = 50000000000000000000;
        const res = formattedNum(val);
        const expected = '$50000000t';
        expect(res).toBe(expected);
      });

      test('computes a valid formatted string (thousands)', () => {
        const val = 50000;
        const res = formattedNum(val);
        const expected = '$50,000';
        expect(res).toBe(expected);
      });

      test('computes a valid formatted string (short)', () => {
        const val = 750;
        const res = formattedNum(val);
        const expected = '$750.00';
        expect(res).toBe(expected);
      });

      test('computes a valid formatted string (single)', () => {
        const val = 8;
        const res = formattedNum(val);
        const expected = '$8.00';
        expect(res).toBe(expected);
      });

      test('computes a valid formatted string (fractions)', () => {
        const val = 12.57;
        const res = formattedNum(val);
        const expected = '$12.57';
        expect(res).toBe(expected);
      });

      test('computes a valid formatted string (small fraction)', () => {
        const val = 0.0725;
        const res = formattedNum(val);
        const expected = '$0.0725';
        expect(res).toBe(expected);
      });

      test('computes a valid formatted string (ridiculous small amount)', () => {
        const val = 0.00001;
        const res = formattedNum(val);
        const expected = '< $0.0001';
        expect(res).toBe(expected);
      });
    });
  });
});

describe('formatPriceForChart', () => {
  it('should provide a formatted price when value is string', () => {
    const formatted = formatPriceForChart({
      value: '100',
      abbreviation: 'CYCLES',
    });
    expect(formatted).toBe('100 TC');
  });

  it('should provide a formatted price when value is number', () => {
    const formatted = formatPriceForChart({
      value: 350,
      abbreviation: 'CYCLES',
    });
    expect(formatted).toBe('350 TC');
  });

  it('should provide a formatted price for USD', () => {
    const formatted = formatPriceForChart({
      value: 25,
      abbreviation: 'USD',
    });
    expect(formatted).toBe('$25');
  });

  it('should provide a formatted price for small USD', () => {
    const formatted = formatPriceForChart({
      value: 0.000000000125,
      abbreviation: 'USD',
    });
    expect(formatted).toBe('$0.000000000125');
  });

  it('should provide a formatted price for M USD', () => {
    const formatted = formatPriceForChart({
      value: 5000000,
      abbreviation: 'USD',
    });
    expect(formatted).toBe('$5M');
  });

  it('should provide a formatted price for B USD', () => {
    const formatted = formatPriceForChart({
      value: 5000000000,
      abbreviation: 'USD',
    });
    expect(formatted).toBe('$5B');
  });

  it('should provide a formatted price for T USD', () => {
    const formatted = formatPriceForChart({
      value: 5000000000000,
      abbreviation: 'USD',
    });
    expect(formatted).toBe('$5T');
  });

  it('should provide a formatted price for CYCLES (base Trillion Cycles TC)', () => {
    const formatted = formatPriceForChart({
      value: 22,
      abbreviation: 'CYCLES',
    });
    expect(formatted).toBe('22 TC');
  });

  it('should provide a formatted price for M of Trillion Cycles (TC)', () => {
    const formatted = formatPriceForChart({
      value: 1000000,
      abbreviation: 'CYCLES',
    });
    expect(formatted).toBe('1,000,000 TC');
  });

  it('should provide a formatted price for B of Trillion Cycles (TC)', () => {
    const formatted = formatPriceForChart({
      value: 1000000000,
      abbreviation: 'CYCLES',
    });
    expect(formatted).toBe('1,000,000,000 TC');
  });

  it('should provide a formatted price for T of Trillion Cycles (TC)', () => {
    const formatted = formatPriceForChart({
      value: 1000000000000,
      abbreviation: 'CYCLES',
    });
    expect(formatted).toBe('1,000,000,000,000 TC');
  });

  it('should provide a formatted price for decimal point CYCLES', () => {
    const formatted = formatPriceForChart({
      value: 0.00000100,
      abbreviation: 'CYCLES',
    });
    expect(formatted).toBe('0.000001 TC');
  });
});

describe('computeValueToLocale', () => {
  it('should compute value of type string', () => {
    const computedValue = computeValueToLocale({
      value: '2500',
    });
    expect(computedValue).toBe('2.50k');
  });

  it('should compute value of type number', () => {
    const computedValue = computeValueToLocale({
      value: 7885,
    });
    expect(computedValue).toBe('7.89k');
  });

  it('should compute value that has decimals', () => {
    const computedValue = computeValueToLocale({
      value: 1250.99,
    });
    expect(computedValue).toBe('1.25k');
  });

  it('should compute value that has decimals (round up)', () => {
    const computedValue = computeValueToLocale({
      value: 1299.019,
    });
    expect(computedValue).toBe('1.30k');
  });

  it('should compute value that has decimals (ommit)', () => {
    const computedValue = computeValueToLocale({
      value: 379.000000001,
    });
    expect(computedValue).toBe('379.00');
  });
});

describe('scientificNotationSmallNumHandler', () => {
  it('should remove trailing zeros (small number)', () => {
    const computed = scientificNotationSmallNumHandler({
      value: 0.00003900,
    });
    expect(computed).toBe('0.000039');
  });

  it('should remove trailing zeros (smaller number)', () => {
    const computed = scientificNotationSmallNumHandler({
      value: 0.000000001200,
    });
    expect(computed).toBe('0.0000000012');
  });

  it('should not remove any (no trailing zeros)', () => {
    const computed = scientificNotationSmallNumHandler({
      value: 0.000000001201,
    });
    expect(computed).toBe('0.000000001201');
  });
});
